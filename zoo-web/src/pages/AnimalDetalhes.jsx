import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnimalById, updateAnimal, deleteAnimal, getCuidados, createCuidado, deleteCuidado, updateCuidado } from '../services/dataService';
import Modal from '../components/Modal';

function AnimalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [animal, setAnimal] = useState(null);
  const [cuidados, setCuidados] = useState([]);
  
  // --- ESTADOS DE CONTROLE DOS MODAIS ---
  const [modalStatus, setModalStatus] = useState({
    editAnimal: false,
    careForm: false, 
    confirmDeleteAnimal: false,
    confirmDeleteCare: false,
    success: false
  });

  // Mensagem do modal de sucesso
  const [successMsg, setSuccessMsg] = useState('');
  
  // ID temporário para exclusão/edição
  const [selectedCareId, setSelectedCareId] = useState(null);

  // --- FORMULÁRIOS ---
  const [editAnimalForm, setEditAnimalForm] = useState({});
  const [careForm, setCareForm] = useState({ id: null, nome: '', descricao: '', frequencia: '' });
  const [isEditingCare, setIsEditingCare] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const animalRes = await getAnimalById(id);
      setAnimal(animalRes.data);
      setEditAnimalForm(animalRes.data);

      // Carrega cuidados e filtra pelo nome do animal (Solução provisória do DTO)
      const cuidadosRes = await getCuidados();
      // O ideal seria filtrar por ID, mas vamos usar o nome como link por enquanto
      const cuidadosDesteAnimal = cuidadosRes.data.filter(c => c.nomeAnimal === animalRes.data.nome);
      setCuidados(cuidadosDesteAnimal);

    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  // --- AÇÕES DE ANIMAL ---

  const handleUpdateAnimal = async (e) => {
    e.preventDefault();
    try {
      await updateAnimal(id, {
        ...editAnimalForm,
        usuarioId: parseInt(sessionStorage.getItem('usuarioId')),
        especieId: editAnimalForm.especieId, 
        habitatId: editAnimalForm.habitatId
      });
      
      setModalStatus({ ...modalStatus, editAnimal: false, success: true });
      setSuccessMsg('Dados do animal atualizados com sucesso!');
      loadData();
    } catch (error) {
      alert('Erro ao atualizar. Verifique os dados.');
    }
  };

  const confirmDeleteAnimal = async () => {
    try {
      await deleteAnimal(id);
      navigate('/animais');
    } catch (error) {
      alert('Erro ao excluir animal.');
    }
  };

  // --- AÇÕES DE CUIDADO (VACINAS/TRATAMENTOS) ---

  const openNewCareModal = () => {
    setCareForm({ id: null, nome: '', descricao: '', frequencia: '' });
    setIsEditingCare(false);
    setModalStatus({ ...modalStatus, careForm: true });
  };

  const openEditCareModal = (care) => {
    setCareForm(care);
    setIsEditingCare(true);
    setModalStatus({ ...modalStatus, careForm: true });
  };

  const handleSaveCare = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nome: careForm.nome,
        descricao: careForm.descricao,
        frequencia: careForm.frequencia,
        animalId: parseInt(id) // ID da URL
      };

      if (isEditingCare) {
        await updateCuidado(careForm.id, payload);
        setSuccessMsg('Cuidado atualizado com sucesso!');
      } else {
        await createCuidado(payload);
        setSuccessMsg('Novo cuidado adicionado!');
      }

      setModalStatus({ ...modalStatus, careForm: false, success: true });
      loadData();
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar cuidado.');
    }
  };

  const confirmDeleteCare = async () => {
    try {
      await deleteCuidado(selectedCareId);
      setModalStatus({ ...modalStatus, confirmDeleteCare: false, success: true });
      setSuccessMsg('Registro removido.');
      loadData();
    } catch (error) {
      alert('Erro ao remover cuidado.');
    }
  };

  if (!animal) return <div className="container">Carregando dados da selva...</div>;

  return (
    <div className="container">
      <button className="btn btn-outline" onClick={() => navigate('/animais')} style={{ marginBottom: '20px' }}>← Voltar</button>
      
      {/* CARD PRINCIPAL DO ANIMAL */}
      <div className="card" style={{ marginBottom: '30px', borderTop: '5px solid var(--jungle-dark)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ color: 'var(--jungle-dark)', margin: 0 }}>{animal.nome}</h1>
            <span style={{ background: 'var(--jungle-light)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
              {animal.especie}
            </span>
            <span style={{ marginLeft: '10px', color: '#666' }}>📍 {animal.habitat}</span>
            
            <p style={{ marginTop: '15px', fontStyle: 'italic', color: '#555' }}>"{animal.descricao}"</p>
            
            <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#888' }}>
              <strong>Origem:</strong> {animal.paisOrigem || 'Desconhecida'} <br/>
              <strong>Nascimento:</strong> {animal.dataNascimento ? new Date(animal.dataNascimento).toLocaleDateString() : 'Não informado'}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn btn-primary" onClick={() => setModalStatus({...modalStatus, editAnimal: true})}>
              ✏️ Editar Animal
            </button>
            <button className="btn btn-danger" onClick={() => setModalStatus({...modalStatus, confirmDeleteAnimal: true})}>
              🗑️ Excluir Animal
            </button>
          </div>
        </div>
      </div>

      {/* SEÇÃO DE CUIDADOS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ color: 'var(--jungle-mid)' }}>🏥 Histórico de Cuidados</h2>
        <button className="btn btn-primary" onClick={openNewCareModal}>+ Adicionar Registro</button>
      </div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {cuidados.length === 0 && <p style={{color: '#888'}}>Nenhum registro veterinário encontrado.</p>}
        
        {cuidados.map(care => (
          <div key={care.id} className="card" style={{ borderLeft: '4px solid var(--warning)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h4 style={{ margin: 0, color: 'var(--text-dark)' }}>{care.nome}</h4>
                <span style={{ fontSize: '0.8rem', background: '#fff3e0', padding: '2px 6px', borderRadius: '4px', color: '#e65100' }}>
                  {care.frequencia}
                </span>
              </div>
              <p style={{ marginTop: '5px', color: '#666' }}>{care.descricao}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
              <button 
                className="btn btn-outline" 
                style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                onClick={() => openEditCareModal(care)}
              >
                Editar
              </button>
              <button 
                className="btn btn-danger" 
                style={{ padding: '5px 10px', fontSize: '0.8rem' }} 
                onClick={() => {
                  setSelectedCareId(care.id);
                  setModalStatus({ ...modalStatus, confirmDeleteCare: true });
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAIS --- */}

      {/* 1. EDITAR ANIMAL */}
      {modalStatus.editAnimal && (
        <Modal onClose={() => setModalStatus({...modalStatus, editAnimal: false})} title={`Editar ${animal.nome}`}>
          <form onSubmit={handleUpdateAnimal}>
            <label style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Nome</label>
            <input className="input-field" value={editAnimalForm.nome || ''} onChange={e => setEditAnimalForm({...editAnimalForm, nome: e.target.value})} required />
            
            <label style={{fontSize: '0.9rem', fontWeight: 'bold'}}>País de Origem</label>
            <input className="input-field" value={editAnimalForm.paisOrigem || ''} onChange={e => setEditAnimalForm({...editAnimalForm, paisOrigem: e.target.value})} />
            
            <label style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Descrição</label>
            <textarea className="input-field" rows="3" value={editAnimalForm.descricao || ''} onChange={e => setEditAnimalForm({...editAnimalForm, descricao: e.target.value})} />
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Salvar Alterações</button>
          </form>
        </Modal>
      )}

      {/* 2. FORMULÁRIO DE CUIDADO (CRIAR/EDITAR) */}
      {modalStatus.careForm && (
        <Modal onClose={() => setModalStatus({...modalStatus, careForm: false})} title={isEditingCare ? "Editar Cuidado" : "Novo Cuidado"}>
          <form onSubmit={handleSaveCare}>
            <input className="input-field" placeholder="Nome (ex: Vacina Antirrábica)" value={careForm.nome} onChange={e => setCareForm({...careForm, nome: e.target.value})} required />
            <input className="input-field" placeholder="Frequência (ex: Anual, Mensal)" value={careForm.frequencia} onChange={e => setCareForm({...careForm, frequencia: e.target.value})} required />
            <textarea className="input-field" placeholder="Detalhes do procedimento..." value={careForm.descricao} onChange={e => setCareForm({...careForm, descricao: e.target.value})} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              {isEditingCare ? "Atualizar Registro" : "Adicionar Registro"}
            </button>
          </form>
        </Modal>
      )}

      {/* 3. CONFIRMAR EXCLUSÃO ANIMAL */}
      {modalStatus.confirmDeleteAnimal && (
        <Modal onClose={() => setModalStatus({...modalStatus, confirmDeleteAnimal: false})} title="⚠️ Zona de Perigo">
          <div style={{textAlign: 'center'}}>
            <p>Tem certeza que deseja remover o animal <strong>{animal.nome}</strong>?</p>
            <p style={{fontSize: '0.9rem', color: 'red'}}>Isso apagará também todo o histórico de cuidados.</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px'}}>
              <button className="btn btn-outline" onClick={() => setModalStatus({...modalStatus, confirmDeleteAnimal: false})}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmDeleteAnimal}>Confirmar Exclusão</button>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. CONFIRMAR EXCLUSÃO CUIDADO */}
      {modalStatus.confirmDeleteCare && (
        <Modal onClose={() => setModalStatus({...modalStatus, confirmDeleteCare: false})} title="Remover Cuidado">
          <div style={{textAlign: 'center'}}>
            <p>Confirma a exclusão deste registro médico?</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px'}}>
              <button className="btn btn-outline" onClick={() => setModalStatus({...modalStatus, confirmDeleteCare: false})}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmDeleteCare}>Sim, remover</button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. SUCESSO */}
      {modalStatus.success && (
        <Modal onClose={() => setModalStatus({...modalStatus, success: false})} title="Sucesso">
          <div style={{textAlign: 'center', padding: '20px'}}>
            <div style={{fontSize: '3rem'}}>✅</div>
            <p style={{fontSize: '1.1rem', margin: '10px 0'}}>{successMsg}</p>
            <button className="btn btn-primary" onClick={() => setModalStatus({...modalStatus, success: false})}>Continuar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AnimalDetalhes;