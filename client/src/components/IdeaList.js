import IdeasApi from '../services/ideasApi';

class IdeaList {
  constructor() {
    this._ideaListEl = document.getElementById('idea-list');
    this._ideas = [];
    this.getIdeas();
    this._validTags = new Set();
    this._validTags.add('technology');
    this._validTags.add('software');
    this._validTags.add('business');
    this._validTags.add('education');
    this._validTags.add('health');
    this._validTags.add('inventions');
  }

  addEventListeners() {
    this._ideaListEl.addEventListener('click', (e) => {
      if (e.target.classList.contains('fa-times')) {
        e.stopImmediatePropagation();
        const ideaId = e.target.parentElement.parentElement.dataset.id;
        this.deleteIdea(ideaId);
      }
      if (e.target.classList.contains('update')) {
        e.stopImmediatePropagation();
        const ideaId = e.target.parentElement.dataset.id;
        this.updateIdea(ideaId);
      }
    });
  }

  async getIdeas() {
    try {
      const res = await IdeasApi.getIdeas();
      this._ideas = res.data.data;
      this.render();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteIdea(ideaId) {
    try {
      await IdeasApi.deleteIdea(ideaId);
      this._ideas.filter((idea) => idea._id !== ideaId);
      this.getIdeas();
    } catch (error) {
      alert('You can not delete this resource');
    }
  }

  async updateIdea(ideaId) {
    const idea = this._ideas.find((idea) => idea._id === ideaId);
    document.dispatchEvent(new CustomEvent('editIdea', { detail: idea }));
    document.dispatchEvent(new Event('openmodal'));
  }

  addIdeaToList(idea) {
    this._ideas.push(idea);
    this.render();
  }

  getTagClassName(tag) {
    tag = tag.toLowerCase();
    let tagClassName = '';
    if (this._validTags.has(tag)) {
      tagClassName = `tag-${tag}`;
    }
    return tagClassName;
  }

  render() {
    this._ideaListEl.innerHTML = this._ideas
      .map((idea) => {
        const tagClass = this.getTagClassName(idea.tag);
        const deleteBtn =
          idea.username === localStorage.getItem('username')
            ? `<button class="delete">
              <i class="fas fa-times"></i>
            </button>`
            : '';
        const updateBtn =
          idea.username === localStorage.getItem('username')
            ? `<button class="update">
          Update Idea
        </button>`
            : '';
        return `<div class="card" data-id="${idea._id}">
        ${deleteBtn}
        <h3>
          ${idea.text}
        </h3>
        <p class="tag ${tagClass}">${idea.tag.toUpperCase()}</p>
        <p>
          Posted on <span class="date">${idea.date}</span> by
          <span class="author">${idea.username}</span>
        </p>
        ${updateBtn}
      </div>`;
      })
      .join('');
    this.addEventListeners();
  }
}

export default IdeaList;
