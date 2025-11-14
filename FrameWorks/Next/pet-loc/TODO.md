# TODO - Implementar Autenticação Persistente na Loja

## Tarefas Pendentes

### 1. Adicionar AuthProvider Global
- [ ] Modificar `src/app/layout.tsx` para incluir o AuthProvider
- [ ] Garantir que o estado de autenticação seja compartilhado entre todas as páginas

### 2. Atualizar Página da Loja
- [ ] Modificar `src/app/loja/page.tsx` para usar `useAuth` em vez de `localStorage`
- [ ] Remover verificações manuais de localStorage
- [ ] Implementar logout manual apenas quando clicado em "Sair"

### 3. Verificar Outras Páginas
- [ ] Verificar se outras páginas precisam de ajustes similares
- [ ] Garantir consistência na autenticação

### 4. Testar Funcionalidade
- [ ] Testar navegação entre páginas mantendo login
- [ ] Testar logout manual
- [ ] Verificar que não desloga automaticamente ao sair da loja
