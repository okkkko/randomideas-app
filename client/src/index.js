import '@fortawesome/fontawesome-free/css/all.css';
import Modal from './components/Modal';
import './css/style.css';
import IdeaForm from './components/IdeaForm';
import IdeaList from './components/IdeaList';

new Modal();
const ideaForm = new IdeaForm();
ideaForm.render();
new IdeaList();
