import { useState, useEffect } from 'react';
import { getCuidados, deleteCuidado } from '../services/dataService';
import Modal from '../components/Modal';

function Cuidados() {
  const [cuidados, setCuidados] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Controle de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await getCuidados();
      setCuidados(response.data);
    } catch (error) {
      console.error("Erro ao buscar cuidados", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCuidado(selectedId);
      setShowDeleteModal(false);
      loadData(); // Recarrega a lista
    } catch (error) {
      alert('Erro ao excluir cuidado.');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ borderLeft: '5px solid var(--jungle-mid)', marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--jungle-dark)', margin: 0 }}>🏥 Central de Veterinária</h2>
        <p style={{ color: '#666', marginTop: '5px' }}>Visão geral de todos os tratamentos do zoológico</p>
      </div>

      {loading ? (
        <p>Carregando prontuários...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {cuidados.map((item) => (
            <div key={item.id} className="card" style={{ position: 'relative', paddingBottom: '50px' }}>
              <div style={{ 
                position: 'absolute', top: 15, right: 15, 
                background: 'var(--sand)', color: 'var(--jungle-dark)', 
                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' 
              }}>
                {item.frequencia}
              </div>
              
              <h3 style={{ color: 'var(--jungle-mid)', marginBottom: '5px' }}>{item.nome}</h3>
              
              <p style={{ fontWeight: 'bold', color: '#444', marginBottom: '10px' }}>
                Paciente: {item.nomeAnimal || "Animal não identificado"}
              </p>
              
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {item.descricao}
              </p>

              {/* Botão de Excluir no rodapé do card */}
              <div style={{ position: 'absolute', bottom: 15, right: 15 }}>
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                  onClick={() => handleDeleteClick(item.id)}
                >
                  🗑️ Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {cuidados.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          Nenhum registro de cuidado encontrado no sistema.
        </p>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)} title="Excluir Registro">
          <div style={{ textAlign: 'center' }}>
            <p>Tem certeza que deseja remover este registro de cuidado?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
              <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmDelete}>Confirmar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Cuidados;