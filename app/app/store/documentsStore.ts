import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkflowTab {
  id: string;
  name: string;
  file: File;
  type: "petitioner" | "beneficiary" | "form";
}

interface DocumentsState {
  petitionerFiles: File[];
  beneficiaryFiles: File[];
  formFiles: File[];
  activeDocType: "petitioner" | "beneficiary";
  activeTab: string;
  workflowTabs: WorkflowTab[];
  activeWorkflowTab: string | null;
  setPetitionerFiles: (files: File[]) => void;
  setBeneficiaryFiles: (files: File[]) => void;
  setFormFiles: (files: File[]) => void;
  addPetitionerFiles: (files: File[]) => void;
  addBeneficiaryFiles: (files: File[]) => void;
  addFormFiles: (files: File[]) => void;
  removePetitionerFile: (index: number) => void;
  removeBeneficiaryFile: (index: number) => void;
  removeFormFile: (index: number) => void;
  setActiveDocType: (type: "petitioner" | "beneficiary") => void;
  setActiveTab: (tab: string) => void;
  addWorkflowTab: (
    file: File,
    type: "petitioner" | "beneficiary" | "form"
  ) => void;
  removeWorkflowTab: (tabId: string) => void;
  setActiveWorkflowTab: (tabId: string | null) => void;
  reorderWorkflowTabs: (fromIndex: number, toIndex: number) => void;
}

// Create a custom storage object to handle File objects
const customStorage = {
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return JSON.parse(str, (key, value) => {
      return value;
    });
  },
  setItem: (name: string, value: unknown) => {
    // We'll serialize only the non-File data
    const serializedValue = JSON.stringify(value, (key, val) => {
      // Skip File objects when serializing
      if (key === "state") {
        const state = { ...val };
        // Remove File arrays as they can't be serialized
        delete state.petitionerFiles;
        delete state.beneficiaryFiles;
        delete state.formFiles;
        delete state.workflowTabs; // Don't serialize workflow tabs containing File objects
        return state;
      }
      return val;
    });
    localStorage.setItem(name, serializedValue);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useDocumentsStore = create<DocumentsState>()(
  persist(
    (set) => ({
      petitionerFiles: [],
      beneficiaryFiles: [],
      formFiles: [],
      activeDocType: "petitioner",
      activeTab: "documents",
      workflowTabs: [],
      activeWorkflowTab: null,
      setPetitionerFiles: (files) => set({ petitionerFiles: files }),
      setBeneficiaryFiles: (files) => set({ beneficiaryFiles: files }),
      setFormFiles: (files) => set({ formFiles: files }),
      addPetitionerFiles: (files) =>
        set((state) => ({
          petitionerFiles: [...state.petitionerFiles, ...files],
        })),
      addBeneficiaryFiles: (files) =>
        set((state) => ({
          beneficiaryFiles: [...state.beneficiaryFiles, ...files],
        })),
      addFormFiles: (files) =>
        set((state) => ({
          formFiles: [...state.formFiles, ...files],
        })),
      removePetitionerFile: (index) =>
        set((state) => {
          const fileToRemove = state.petitionerFiles[index];
          const newPetitionerFiles = state.petitionerFiles.filter(
            (_, i) => i !== index
          );

          // Remove corresponding workflow tabs
          const newWorkflowTabs = state.workflowTabs.filter(
            (tab) =>
              !(
                tab.file.name === fileToRemove?.name &&
                tab.type === "petitioner"
              )
          );

          // Update active tab if the removed file was active
          const newActiveTab = state.workflowTabs.find(
            (tab) =>
              tab.file.name === fileToRemove?.name &&
              tab.type === "petitioner" &&
              tab.id === state.activeWorkflowTab
          )
            ? newWorkflowTabs.length > 0
              ? newWorkflowTabs[newWorkflowTabs.length - 1].id
              : null
            : state.activeWorkflowTab;

          return {
            petitionerFiles: newPetitionerFiles,
            workflowTabs: newWorkflowTabs,
            activeWorkflowTab: newActiveTab,
          };
        }),
      removeBeneficiaryFile: (index) =>
        set((state) => {
          const fileToRemove = state.beneficiaryFiles[index];
          const newBeneficiaryFiles = state.beneficiaryFiles.filter(
            (_, i) => i !== index
          );

          // Remove corresponding workflow tabs
          const newWorkflowTabs = state.workflowTabs.filter(
            (tab) =>
              !(
                tab.file.name === fileToRemove?.name &&
                tab.type === "beneficiary"
              )
          );

          // Update active tab if the removed file was active
          const newActiveTab = state.workflowTabs.find(
            (tab) =>
              tab.file.name === fileToRemove?.name &&
              tab.type === "beneficiary" &&
              tab.id === state.activeWorkflowTab
          )
            ? newWorkflowTabs.length > 0
              ? newWorkflowTabs[newWorkflowTabs.length - 1].id
              : null
            : state.activeWorkflowTab;

          return {
            beneficiaryFiles: newBeneficiaryFiles,
            workflowTabs: newWorkflowTabs,
            activeWorkflowTab: newActiveTab,
          };
        }),
      removeFormFile: (index) =>
        set((state) => {
          const fileToRemove = state.formFiles[index];
          const newFormFiles = state.formFiles.filter((_, i) => i !== index);

          // Remove corresponding workflow tabs
          const newWorkflowTabs = state.workflowTabs.filter(
            (tab) =>
              !(tab.file.name === fileToRemove?.name && tab.type === "form")
          );

          // Update active tab if the removed file was active
          const newActiveTab = state.workflowTabs.find(
            (tab) =>
              tab.file.name === fileToRemove?.name &&
              tab.type === "form" &&
              tab.id === state.activeWorkflowTab
          )
            ? newWorkflowTabs.length > 0
              ? newWorkflowTabs[newWorkflowTabs.length - 1].id
              : null
            : state.activeWorkflowTab;

          return {
            formFiles: newFormFiles,
            workflowTabs: newWorkflowTabs,
            activeWorkflowTab: newActiveTab,
          };
        }),
      setActiveDocType: (type) => set({ activeDocType: type }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      addWorkflowTab: (file, type) =>
        set((state) => {
          const id = `${type}-${file.name}-${Date.now()}`;
          const existingTab = state.workflowTabs.find(
            (tab) => tab.file.name === file.name && tab.type === type
          );

          if (existingTab) {
            // If tab already exists, just activate it
            return { activeWorkflowTab: existingTab.id };
          }

          const newTab: WorkflowTab = {
            id,
            name: file.name,
            file,
            type,
          };

          return {
            workflowTabs: [...state.workflowTabs, newTab],
            activeWorkflowTab: id,
          };
        }),
      removeWorkflowTab: (tabId) =>
        set((state) => {
          const newTabs = state.workflowTabs.filter((tab) => tab.id !== tabId);
          const newActiveTab =
            state.activeWorkflowTab === tabId
              ? newTabs.length > 0
                ? newTabs[newTabs.length - 1].id
                : null
              : state.activeWorkflowTab;

          return {
            workflowTabs: newTabs,
            activeWorkflowTab: newActiveTab,
          };
        }),
      setActiveWorkflowTab: (tabId) => set({ activeWorkflowTab: tabId }),
      reorderWorkflowTabs: (fromIndex, toIndex) =>
        set((state) => {
          const newTabs = [...state.workflowTabs];
          const [moved] = newTabs.splice(fromIndex, 1);
          newTabs.splice(toIndex, 0, moved);
          return { workflowTabs: newTabs };
        }),
    }),
    {
      name: "documents-storage",
      storage: customStorage,
    }
  )
);
