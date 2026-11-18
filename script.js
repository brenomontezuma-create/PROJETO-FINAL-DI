// ===== Acessibilidade: tema, fonte e contraste =====
const raiz = document.documentElement;
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const ler = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };

let tamanho = parseInt(ler('fonte')) || 100;
function aplicarFonte() { raiz.style.fontSize = tamanho + '%'; guardar('fonte', tamanho); }

function aplicarTema(escuro) {
  if (escuro) raiz.setAttribute('data-tema', 'escuro'); else raiz.removeAttribute('data-tema');
  const b = document.getElementById('tema');
  if (b) { b.textContent = escuro ? '☀️ Claro' : '🌙 Escuro'; b.setAttribute('aria-pressed', escuro); }
  guardar('tema', escuro ? 'escuro' : 'claro');
}
function aplicarContraste(alto) {
  if (alto) raiz.setAttribute('data-contraste', 'alto'); else raiz.removeAttribute('data-contraste');
  const b = document.getElementById('contraste');
  if (b) b.setAttribute('aria-pressed', alto);
  guardar('contraste', alto ? 'alto' : 'normal');
}

aplicarFonte();
const temaSalvo = ler('tema');
aplicarTema(temaSalvo ? temaSalvo === 'escuro' : window.matchMedia('(prefers-color-scheme: dark)').matches);
aplicarContraste(ler('contraste') === 'alto');

const q = id => document.getElementById(id);
q('maior')?.addEventListener('click', () => { tamanho = Math.min(tamanho + 10, 150); aplicarFonte(); });
q('menor')?.addEventListener('click', () => { tamanho = Math.max(tamanho - 10, 80); aplicarFonte(); });
q('tema')?.addEventListener('click', () => aplicarTema(!raiz.hasAttribute('data-tema')));
q('contraste')?.addEventListener('click', () => aplicarContraste(!raiz.hasAttribute('data-contraste')));

// ===== Carrossel =====
const slides = document.querySelectorAll('.slide');
if (slides.length) {
  const pontos = q('pontos');
  let atual = 0;
  slides.forEach((_, i) => {
    const p = document.createElement('button');
    p.setAttribute('aria-label', 'Ir para o slide ' + (i + 1));
    p.addEventListener('click', () => mostrar(i));
    pontos.appendChild(p);
  });
  function mostrar(i) {
    atual = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('ativo', n === atual));
    [...pontos.children].forEach((p, n) => p.classList.toggle('ativo', n === atual));
  }
  q('ant').addEventListener('click', () => mostrar(atual - 1));
  q('prox').addEventListener('click', () => mostrar(atual + 1));
  mostrar(0);
}

// ===== Busca e abas de projetos =====
const cartoes = document.querySelectorAll('#lista .cartao');
let categoria = 'todos';
function filtrar() {
  const termo = (q('busca')?.value || '').toLowerCase();
  let visiveis = 0;
  cartoes.forEach(c => {
    const ok = (categoria === 'todos' || c.dataset.cat === categoria) && c.textContent.toLowerCase().includes(termo);
    c.hidden = !ok;
    if (ok) visiveis++;
  });
  if (q('vazio')) q('vazio').hidden = visiveis > 0;
}
q('busca')?.addEventListener('input', filtrar);
document.querySelectorAll('.aba').forEach(a => a.addEventListener('click', () => {
  document.querySelectorAll('.aba').forEach(x => x.classList.remove('ativa'));
  a.classList.add('ativa');
  categoria = a.dataset.cat;
  filtrar();
}));

// ===== Formulário de contato =====
q('form')?.addEventListener('submit', e => {
  e.preventDefault();
  const campos = ['nome', 'email', 'msg'].map(q);
  let valido = true;
  campos.forEach(c => {
    const ok = c.value.trim() && (c.type !== 'email' || /^\S+@\S+\.\S+$/.test(c.value));
    c.classList.toggle('erro', !ok);
    c.setAttribute('aria-invalid', !ok);
    if (!ok) valido = false;
  });
  const s = q('status');
  s.className = valido ? 'ok' : 'err';
  s.textContent = valido ? 'Mensagem enviada com sucesso! (simulação)' : 'Preencha todos os campos corretamente.';
  if (valido) e.target.reset();
});

// ===== Login (apenas simulação no navegador) =====
q('login')?.addEventListener('submit', e => {
  e.preventDefault();
  const u = q('usuario').value.trim(), s = q('senha').value;
  const m = q('msg-login');
  if (u && s.length >= 4) { m.className = 'ok'; m.textContent = 'Login realizado! Redirecionando...'; setTimeout(() => location.href = 'index.html', 1000); }
  else { m.className = 'err'; m.textContent = 'Informe usuário e senha (mínimo 4 caracteres).'; }
});
