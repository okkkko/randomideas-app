import IdeasApi from '../services/ideasApi';
import IdeaList from './IdeaList';

class IdeaForm {
  constructor() {
    this._formModal = document.getElementById('form-modal');
    this._ideaList = new IdeaList();
    this.render();
    document.addEventListener('editIdea', this.handleEdit.bind(this));
  }

  render() {
    this._formModal.innerHTML = this.formTemplate();
    this._form = document.getElementById('idea-form');
    this.addEventListeners();
  }

  formTemplate() {
    const username = localStorage.getItem('username') || '';
    return `
      <form id="idea-form">
        <div class="form-control">
          <label for="idea-text">Enter a Username</label>
          <input type="text" name="username" id="username" value="${username}"/>
        </div>
        <div class="form-control">
          <label for="idea-text">What's Your Idea?</label>
          <textarea name="text" id="idea-text"></textarea>
        </div>
        <div class="form-control">
          <label for="tag">Tag</label>
          <input type="text" name="tag" id="tag" />
        </div>
        <input type="hidden" name="id"/>
        <button class="btn" type="submit" id="submit">Submit</button>
      </form>
    `;
  }

  handleEdit(event) {
    const { text, tag, username, _id } = event.detail;
    this._form.elements.text.value = text;
    this._form.elements.tag.value = tag;
    this._form.elements.username.value = username;
    this._form.elements.id.value = _id;
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (!this.validateForm()) {
      alert('Please enter all fields');
      return;
    }

    const formData = this.getFormData();
    const { id, ...idea } = formData;

    try {
      localStorage.setItem('username', this._form.elements.username.value);
      id ? await this.updateIdea(id, idea) : await this.createIdea(idea);
    } catch (error) {
      this.handleError(error);
    }

    document.dispatchEvent(new Event('closemodal'));
  }

  validateForm() {
    const { text, tag, username } = this._form.elements;
    return text.value && tag.value && username.value;
  }

  getFormData() {
    const { text, tag, username, id } = this._form.elements;
    return {
      text: text.value,
      tag: tag.value,
      username: username.value,
      id: id.value,
    };
  }

  async createIdea(idea) {
    const newIdea = await IdeasApi.createIdea(idea);
    this._ideaList.addIdeaToList(newIdea.data.data);
  }

  async updateIdea(id, idea) {
    await IdeasApi.updateIdea(id, idea);
    this._ideaList.getIdeas();
  }

  handleError(error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }

  resetForm() {
    this._form.reset();
    this._form.elements.id.value = '';
    this.render();
  }

  addEventListeners() {
    this._form.addEventListener('submit', this.handleSubmit.bind(this));
  }
}

export default IdeaForm;
