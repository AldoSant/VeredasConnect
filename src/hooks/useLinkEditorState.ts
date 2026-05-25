import { useState, useRef, useCallback } from "react";
import type { LinkItem } from "@/types"; // Assuming this path is correct for the types definition

interface UseLinkEditorStateProps {
  initialLinks: LinkItem[];
}

/**
 * Gerencia o estado local das conexões (links), incluindo itens adicionados e excluídos temporariamente.
 * @param initialLinks Links recebidos do backend para inicialização.
 * @returns Um objeto contendo os links atualizados e os handlers necessários.
 */
export const useLinkEditorState = ({ initialLinks }: UseLinkEditorStateProps) => {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);

  // Refs para rastrear itens adicionados/deletados localmente (não persistidos no DB)
  const addedLinksRef = useRef<LinkItem[]>([]);
  const deletedIdsRef = useRef<Set<string>>(new Set());

  const markDirty = useCallback(() => {
    // Em um hook de estado, a lógica de 'sujeito a salvar' deve ser controlada pelo componente pai.
    // Aqui, apenas garantimos que as mutações sejam registradas.
  }, []);

  // --- Handlers de Manipulação de Links ---

  const handleUpdateLink = useCallback((id: string, updates: Partial<LinkItem>) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    // A lógica de dirty state deve ser tratada no componente que consome este hook.
  }, []);

  const handleDeleteLink = useCallback((id: string) => {
    // Verifica se era um item recém-adicionado (não está no DB)
    const wasAdded = addedLinksRef.current.some((l) => l.id === id);
    if (wasAdded) {
      addedLinksRef.current = addedLinksRef.current.filter((l) => l.id !== id);
    } else {
      deletedIdsRef.current.add(id);
    }
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const handleAddLink = useCallback((title: string, url: string) => {
    const tempId = crypto.randomUUID();
    // Cria um novo link com o estado inicial e ID temporário
    const newLink: LinkItem = {
      id: tempId,
      profileId: "", // Preenchido posteriormente no save
      type: "link",
      title,
      url,
      isActive: true,
      startDate: null,
      endDate: null,
      sortOrder: links.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addedLinksRef.current.push(newLink);
    setLinks((prev) => [...prev, newLink]);
  }, [links.length]); // Dependência para sortOrder

  const handleAddHeader = useCallback((title: string) => {
    const tempId = crypto.randomUUID();
    const newHeader: LinkItem = {
      id: tempId,
      profileId: "",
      type: "header",
      title,
      url: "",
      isActive: true,
      startDate: null,
      endDate: null,
      sortOrder: links.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addedLinksRef.current.push(newHeader);
    setLinks((prev) => [...prev, newHeader]);
  }, [links.length]);

  const handleAddDivider = useCallback(() => {
    const tempId = crypto.randomUUID();
    const newDivider: LinkItem = {
      id: tempId,
      profileId: "",
      type: "divider",
      title: "",
      url: "",
      isActive: true,
      startDate: null,
      endDate: null,
      sortOrder: links.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addedLinksRef.current.push(newDivider);
    setLinks((prev) => [...prev, newDivider]);
  }, [links.length]);

  const handleReorder = useCallback((reordered: LinkItem[]) => {
    setLinks(reordered);
  }, []);


  return {
    // Estado e Dados
    links,
    addedLinksRef, // Exportando refs para a lógica de persistência no componente pai
    deletedIdsRef,

    // Handlers
    handleUpdateLink,
    handleDeleteLink,
    handleAddLink,
    handleAddHeader,
    handleAddDivider,
    handleReorder,
    markDirty,
  };
};