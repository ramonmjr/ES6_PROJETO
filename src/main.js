import api from "./api";
class App {
  constructor() {
    this.repositories = [];

    this.formEl = document.getElementById("repo-form");
    this.inputEl = document.querySelector("input[name=repository]");
    this.listEl = document.getElementById("repo-list");

    this.registerHandles();
  }
  registerHandles() {
    this.formEl.onsubmit = event => this.addRepository(event);
  }

  async addRepository(event) {
    event.preventDefault();

    const repoInput = this.inputEl.value;

    try {
      if (repoInput.length === 0) return;

      this.setLoading();
      const response = await api.get(`repos/${repoInput}`);

      const {
        name,
        description,
        html_url,
        owner: { avatar_url }
      } = response.data;

      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url
      });

      this.inputEl.value = "";

      this.render();
    } catch (err) {
      alert("Repositório não encontrado");
    }

    this.setLoading(false);
  }

  setLoading(loading = true) {
    if (loading === true) {
      let loadingEl = document.createElement("span");
      loadingEl.appendChild(document.createTextNode("Carregando..."));
      loadingEl.setAttribute("id", "loading");

      this.formEl.appendChild(loadingEl);
    } else {
      console.log(loading);
      document.getElementById("loading").remove();
    }
  }

  render() {
    this.listEl.innerHTML = "";

    this.repositories.forEach(repo => {
      let imgEl = document.createElement("img");
      imgEl.setAttribute("src", repo.avatar_url);

      let tittleEl = document.createElement("strong");
      tittleEl.appendChild(document.createTextNode(repo.name));

      let descriptionEl = document.createElement("p");
      descriptionEl.appendChild(document.createTextNode(repo.description));

      let linkEl = document.createElement("a");
      linkEl.setAttribute("target", "_blank");
      linkEl.setAttribute("href", repo.html_url);
      linkEl.appendChild(document.createTextNode("Acessar"));

      let listItemEl = document.createElement("li");
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(tittleEl);
      listItemEl.appendChild(descriptionEl);
      listItemEl.appendChild(linkEl);

      this.listEl.appendChild(listItemEl);
    });
  }
}

new App();
