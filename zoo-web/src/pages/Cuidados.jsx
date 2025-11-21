import { useState, useEffect } from 'react';
import { getCuidados } from '../services/dataService';

function Cuidados() {
  const [cuidados, setCuidados] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <div key={item.id} className="card" style={{ position: 'relative' }}>
              <div style={{ 
                position: 'absolute', top: 15, right: 15, 
                background: 'var(--sand)', color: 'var(--jungle-dark)', 
                padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' 
              }}>
                {item.frequencia}
              </div>
              
              <h3 style={{ color: 'var(--jungle-mid)', marginBottom: '5px' }}>{item.nome}</h3>
              
              {/* Exibe o nome do Animal se o DTO trouxer, senão avisa */}
              <p style={{ fontWeight: 'bold', color: '#444', marginBottom: '10px' }}>
                Paciente: {item.nomeAnimal || "Animal não identificado"}
              </p>
              
              <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {item.descricao}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {cuidados.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          Nenhum registro de cuidado encontrado no sistema.
        </p>
      )}
    </div>
  );
}

export default Cuidados;