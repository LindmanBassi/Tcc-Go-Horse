import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logoutUsuario } from '../../api/authApi';
import styles from '../../styles/header.module.css';
import logo from '../../assets/EventosTech_logo.svg';

export function Header() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const token = localStorage.getItem('token');
        const payload = JSON.parse(atob(token.split('.')[1]));

        console.log(payload);
        setUserData(payload);
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUsuario();
      localStorage.removeItem('token');
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const cargo = userData?.cargo || userData?.role;
  const isFuncionario = cargo && cargo !== 'VISITANTE';
  const isGerente = cargo === 'GERENTE';

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <img src={logo} alt="Logo Eventos Tech" className={styles.logo} />

        <nav className={styles.nav}>
          <Link to="/participacoes" className={styles.navLink}>
            Participe
          </Link>

          {isFuncionario && (
            <>
              <Link to="/locais" className={styles.navLink}>
                Locais
              </Link>

              <Link to="/eventos" className={styles.navLink}>
                Eventos
              </Link>

              {isGerente && (
                <>
                  <Link to="/funcionarios" className={styles.navLink}>
                    Funcionários
                  </Link>
                  <Link to="/usuarios" className={styles.navLink}>
                    Usuários
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {userData && (
          <div className={styles.userInfo}>
            <span className={styles.userText}>
              Bem-vindo, {userData.sub} ({userData.role})
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
