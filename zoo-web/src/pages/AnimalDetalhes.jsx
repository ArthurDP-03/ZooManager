import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimalById, updateAnimal, deleteAnimal, getCuidados, createCuidado, deleteCuidado } from '../services/dataService';
import Modal from '../components/Modal';

function AnimalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [animal, setAnimal] = useState(null);
  const [cuidados, setCuidados] = useState([]);
  
  // Modais
  const [isEditingAnimal, setIsEditingAnimal] = useState(false);
  const [isAddingCare, setIsAddingCare] = useState(false);
  
  // Estados Forms
  const [editForm, setEditForm] = useState({});
  const [careForm, setCareForm] = useState({ nome: '', descricao: '', frequencia: '' });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const animalRes = await getAnimalById(id);
      setAnimal(animalRes.data);
      setEditForm(animalRes.data); // Prepara form de edição com dados atuais

      // Busca cuidados e filtra (Já que a API de GetAnimalById não está trazendo a lista no DTO atual)
      const cuidadosRes = await getCuidados();
      const cuidadosDesteAnimal = cuidadosRes.data.filter(c => c.nomeAnimal === animalRes.data.nome); 
      // Nota: O ideal seria filtrar por ID no backend, mas o DTO de CuidadoResponse retorna NomeAnimal. 
      // Se tiver o ID do animal no CuidadoResponse, use: c.animalId === parseInt(id)
      setCuidados(cuidadosDesteAnimal);

    } catch (error) {
      console.error("Erro ao carregar", error);
    }
  };

  const handleUpdateAnimal = async (e) => {
    e.preventDefault();
    try {
      await updateAnimal(id, {
        ...editForm,
        // Garante que estamos enviando os IDs para o backend (supondo que o editForm tenha especieId e habitatId)
        // Se o DTO de resposta não tem os IDs, você precisará buscar os catálogos novamente aqui para mapear Nome -> ID.
        // Para simplificar, vou assumir que o usuário não mudou a espécie/habitat ou que o DTO tem os IDs.
        usuarioId: parseInt(localStorage.getItem('usuarioId'))
      });
      alert('Animal atualizado!');
      setIsEditingAnimal(false);
      loadData();
    } catch (error) {
      alert('Erro ao atualizar. Verifique os dados.');
    }
  };

  const handleDeleteAnimal = async () => {
    if (confirm('Tem certeza? Isso apagará o animal e seus cuidados.')) {
      await deleteAnimal(id);
      navigate('/animais');
    }
  };

  const handleAddCare = async (e) => {
    e.preventDefault();
    try {
      await createCuidado({
        ...careForm,
        animalId: parseInt(id)
      });
      alert('Cuidado adicionado!');
      setIsAddingCare(false);
      setCareForm({ nome: '', descricao: '', frequencia: '' });
      loadData();
    } catch (error) {
      alert('Erro ao adicionar cuidado.');
    }
  };

  const handleDeleteCare = async (careId) => {
    if (confirm('Remover este cuidado?')) {
      await deleteCuidado(careId);
      loadData();
    }
  };

  if (!animal) return <div className="container">Carregando dados da selva...</div>;

  return (
    <div className="container">
      <button className="btn btn-outline" onClick={() => navigate('/animais')} style={{ marginBottom: '20px' }}>← Voltar</button>
      
      {/* Header do Animal */}
      <div className="card" style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: 'var(--jungle-dark)' }}>{animal.nome}</h1>
            <p style={{ color: '#555', fontSize: '1.1rem' }}>{animal.especie} | {animal.habitat}</p>
            <p style={{ marginTop: '10px' }}>{animal.descricao}</p>
            <small>Origem: {animal.paisOrigem} | Nasc: {new Date(animal.dataNascimento).toLocaleDateString()}</small>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => setIsEditingAnimal(true)}>Editar</button>
            <button className="btn btn-danger" onClick={handleDeleteAnimal}>Excluir</button>
          </div>
        </div>
      </div>

      {/* Seção de Cuidados */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ color: 'var(--jungle-mid)' }}>📋 Rotina de Cuidados</h2>
        <button className="btn btn-primary" onClick={() => setIsAddingCare(true)}>+ Adicionar Cuidado</button>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {cuidados.length === 0 && <p>Nenhum cuidado registrado.</p>}
        {cuidados.map(care => (
          <div key={care.id} className="card" style={{ borderLeft: '4px solid var(--warning)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: 0 }}>{care.nome}</h4>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Frequência: {care.frequencia}</p>
              <p style={{ marginTop: '5px' }}>{care.descricao}</p>
            </div>
            <button className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleDeleteCare(care.id)}>
              Remover
            </button>
          </div>
        ))}
      </div>

      {/* MODAL EDITAR ANIMAL */}
      {isEditingAnimal && (
        <Modal onClose={() => setIsEditingAnimal(false)} title={`Editar ${animal.nome}`}>
          <form onSubmit={handleUpdateAnimal}>
            <input className="input-field" value={editForm.nome || ''} onChange={e => setEditForm({...editForm, nome: e.target.value})} />
            <input className="input-field" value={editForm.paisOrigem || ''} onChange={e => setEditForm({...editForm, paisOrigem: e.target.value})} />
            <textarea className="input-field" value={editForm.descricao || ''} onChange={e => setEditForm({...editForm, descricao: e.target.value})} />
            {/* Adicione selects de habitat/especie aqui igual na criação se desejar editar isso */}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar Alterações</button>
          </form>
        </Modal>
      )}

      {/* MODAL ADICIONAR CUIDADO */}
      {isAddingCare && (
        <Modal onClose={() => setIsAddingCare(false)} title="Novo Cuidado">
          <form onSubmit={handleAddCare}>
            <input className="input-field" placeholder="Nome (ex: Vacinação)" value={careForm.nome} onChange={e => setCareForm({...careForm, nome: e.target.value})} required />
            <input className="input-field" placeholder="Frequência (ex: Semanal)" value={careForm.frequencia} onChange={e => setCareForm({...careForm, frequencia: e.target.value})} required />
            <textarea className="input-field" placeholder="Descrição detalhada" value={careForm.descricao} onChange={e => setCareForm({...careForm, descricao: e.target.value})} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Adicionar</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default AnimalDetalhes;