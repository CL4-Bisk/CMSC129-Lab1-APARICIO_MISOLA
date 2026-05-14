import { createContext, useContext, useMemo, useRef, useState } from "react";
import "./GlobalInfoModal.css";

const GlobalInfoModalContext = createContext(null);

function GlobalInfoModal({ modal, onAction }) {
  if (!modal.isOpen) {
    return null;
  }

  return (
    <div className="global-info-modal-backdrop" role="presentation">
      <div className={`global-info-modal global-info-modal-${modal.type}`} role="dialog" aria-modal="true" aria-labelledby="global-info-modal-title">
        <h2 id="global-info-modal-title">{modal.title}</h2>
        <p>{modal.message}</p>
        <div className="global-info-modal-actions">
          {modal.actions.map((action) => (
            <button
              key={`${action.label}-${action.value}`}
              className={`global-info-modal-button ${action.variant || "primary"}`}
              onClick={() => onAction(action.value)}
              type="button"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GlobalInfoModalProvider({ children }) {
  const resolveRef = useRef(null);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    actions: [],
  });

  const closeModal = (result = true) => {
    setModal((previous) => ({ ...previous, isOpen: false }));
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
  };

  const openModal = ({ type, title, message, actions }) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      actions,
    });
  };

  const showInfo = (title, message) => {
    openModal({
      type: "info",
      title,
      message,
      actions: [{ label: "OK", value: true, variant: "primary" }],
    });
  };

  const showError = (title, message) => {
    openModal({
      type: "error",
      title,
      message,
      actions: [{ label: "Close", value: true, variant: "danger" }],
    });
  };

  const showConfirm = (title, message, options = {}) =>
    new Promise((resolve) => {
      const confirmLabel = options.confirmLabel || "Confirm";
      const cancelLabel = options.cancelLabel || "Cancel";

      resolveRef.current = resolve;
      openModal({
        type: "confirm",
        title,
        message,
        actions: [
          { label: cancelLabel, value: false, variant: "secondary" },
          { label: confirmLabel, value: true, variant: "primary" },
        ],
      });
    });

  const value = useMemo(() => ({
    showInfo,
    showError,
    showConfirm,
  }), []);

  return (
    <GlobalInfoModalContext.Provider value={value}>
      {children}
      <GlobalInfoModal modal={modal} onAction={closeModal} />
    </GlobalInfoModalContext.Provider>
  );
}

export function useGlobalInfoModal() {
  const context = useContext(GlobalInfoModalContext);
  if (!context) {
    throw new Error("useGlobalInfoModal must be used inside GlobalInfoModalProvider.");
  }

  return context;
}
