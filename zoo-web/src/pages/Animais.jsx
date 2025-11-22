import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnimais, getEspecies, getHabitats, createAnimal } from '../services/dataService';
import Modal from '../components/Modal';

function Animais() {
  // Dados
  const [animais, setAnimais] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [habitats, setHabitats] = useState([]);
  
  // Filtros
  const [filtro, setFiltro] = useState({ nome: '', especie: '', habitat: '' });
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  // Nota: Iniciamos com strings vazias para os IDs
  const [novoAnimal, setNovoAnimal] = useState({ 
    nome: '', 
    descricao: '', 
    especieId: '', 
    habitatId: '', 
    paisOrigem: '', 
    dataNascimento: '' 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resAnimais, resEspecies, resHabitats] = await Promise.all([
        getAnimais(), 
        getEspecies(), 
        getHabitats()
      ]);
      setAnimais(resAnimais.data);
      setEspecies(resEspecies.data);
      setHabitats(resHabitats.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  // Lógica de Filtro (Client-Side)
  const animaisFiltrados = animais.filter(animal => {
    const matchNome = animal.nome.toLowerCase().includes(filtro.nome.toLowerCase());
    // Ajuste conforme o retorno do seu DTO (se for nome ou ID)
    const matchEspecie = filtro.especie ? animal.especie === filtro.especie : true; 
    const matchHabitat = filtro.habitat ? animal.habitat === filtro.habitat : true;
    return matchNome && matchEspecie && matchHabitat;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // 1. Validação básica
    if (!novoAnimal.especieId || !novoAnimal.habitatId) {
      alert("Por favor, selecione a Espécie e o Habitat.");
      return;
    }

    try {
      await createAnimal({
        ...novoAnimal,
        // 2. CORREÇÃO: Converter IDs para Inteiro
        especieId: parseInt(novoAnimal.especieId),
        habitatId: parseInt(novoAnimal.habitatId),
        
        // 3. CORREÇÃO: Pegar ID do usuário do sessionStorage (onde o Login salva)
        usuarioId: parseInt(sessionStorage.getItem('usuarioId')),
        
        // Tratamento de data vazia
        dataNascimento: novoAnimal.dataNascimento || null
      });

      alert('Animal cadastrado com sucesso!');
      setShowModal(false);
      
      // Limpa o form para o próximo
      setNovoAnimal({ nome: '', descricao: '', especieId: '', habitatId: '', paisOrigem: '', dataNascimento: '' });
      
      loadData();
    } catch (error) {
      console.error(error);
      alert('Erro ao criar animal. Verifique se você está logado.');
    }
  };

  return (
    <div className="container">
      {/* Header e Filtros */}
      <div className="card" style={{ marginBottom: '30px', borderLeft: '5px solid var(--jungle-mid)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'var(--jungle-dark)' }}>🦁 Catálogo da Selva</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Novo Animal</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input 
            placeholder="Buscar por nome..." className="input-field" style={{flex: 2}}
            value={filtro.nome} onChange={e => setFiltro({...filtro, nome: e.target.value})}
          />
          <select className="input-field" style={{flex: 1}} 
            value={filtro.especie} onChange={e => setFiltro({...filtro, especie: e.target.value})}>
            <option value="">Todas Espécies</option>
            {especies.map(e => <option key={e.id} value={e.nome}>{e.nome}</option>)}
          </select>
          <select className="input-field" style={{flex: 1}}
            value={filtro.habitat} onChange={e => setFiltro({...filtro, habitat: e.target.value})}>
            <option value="">Todos Habitats</option>
            {habitats.map(h => <option key={h.id} value={h.nome}>{h.nome}</option>)}
          </select>
        </div>
      </div>

      {/* Grid de Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {animaisFiltrados.map(animal => (
          <Link to={`/animais/${animal.id}`} key={animal.id} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ height: '100%', cursor: 'pointer' }}>
              <div style={{ backgroundColor: 'var(--jungle-light)', height: '8px', borderRadius: '4px 4px 0 0', marginBottom: '10px' }}></div>
              <h3 style={{ color: 'var(--jungle-dark)' }}>{animal.nome}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', margin: '5px 0' }}>{animal.especie} • {animal.habitat}</p>
              <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                <span style={{ background: '#e8f5e9', padding: '4px 8px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--jungle-dark)' }}>
                  {animal.paisOrigem || 'Origem desc.'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Modal de Criação */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title="Novo Animal">
          <form onSubmit={handleCreate}>
            <input 
                className="input-field" 
                placeholder="Nome" 
                value={novoAnimal.nome}
                onChange={e => setNovoAnimal({...novoAnimal, nome: e.target.value})} 
                required 
            />
            
            {/* 4. CORREÇÃO: Selects corrigidos */}
            <select 
                className="input-field" 
                value={novoAnimal.especieId} 
                onChange={e => setNovoAnimal({...novoAnimal, especieId: e.target.value})} 
                required
            >
                <option value="">Selecione a Espécie</option>
                {especies.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </select>

            <select 
                className="input-field" 
                value={novoAnimal.habitatId}
                onChange={e => setNovoAnimal({...novoAnimal, habitatId: e.target.value})} 
                required
            >
                <option value="">Selecione o Habitat</option>
                {habitats.map(h => <option key={h.id} value={h.id}>{h.nome}</option>)}
            </select>

            <input 
                className="input-field" 
                placeholder="País de Origem" 
                value={novoAnimal.paisOrigem}
                onChange={e => setNovoAnimal({...novoAnimal, paisOrigem: e.target.value})} 
            />
            
            <input 
                className="input-field" 
                type="date" 
                value={novoAnimal.dataNascimento}
                onChange={e => setNovoAnimal({...novoAnimal, dataNascimento: e.target.value})} 
            />
            
            <textarea 
                className="input-field" 
                placeholder="Descrição" 
                rows="3" 
                value={novoAnimal.descricao}
                onChange={e => setNovoAnimal({...novoAnimal, descricao: e.target.value})} 
            />
            
            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
                Salvar
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Animais;