import "./BuildList.css";
import { useState, useEffect } from "react";
import api from "../../api/api.js";
import { useGlobalInfoModal } from "../GlobalInfoModal/GlobalInfoModalContext.jsx";
import { getErrorMessage } from "../../utils/errorMessage.js";

const BUILDS_PER_PAGE = 5;

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "end-ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "start-ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "start-ellipsis", currentPage - 1, currentPage, currentPage + 1, "end-ellipsis", totalPages];
}

function BuildList({ refreshKey = 0 }) {
  const { showError } = useGlobalInfoModal();
  const [builds, setBuilds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api.get("/builds")
      .then((res) => setBuilds(res.data))
      .catch((error) => showError("Build list unavailable", getErrorMessage(error, "Unable to fetch saved builds right now.")));
  }, [refreshKey, showError]);

  const totalPages = Math.max(1, Math.ceil(builds.length / BUILDS_PER_PAGE));
  const pageStart = (currentPage - 1) * BUILDS_PER_PAGE;
  const pagedBuilds = builds.slice(pageStart, pageStart + BUILDS_PER_PAGE);
  const paginationItems = getPaginationItems(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return (
    <div className="build-list">
      <h3>Existing Defenses</h3>
      {builds.length === 0 ? <p>No defenses built yet.</p> : 
        <>
          <div className="build-page">
            {pagedBuilds.map(build => (
              <div key={build.id} className="build-item">
                <div className="build-item-main">
                  <strong>{build.name}</strong> - {build.type}
                </div>
                <div className="build-item-sub">
                  {Array.isArray(build.items) ? `${build.items.length}/6 items selected` : "No item slots saved"}
                </div>
              </div>
            ))}
          </div>

          {builds.length > BUILDS_PER_PAGE && (
            <div className="build-pagination" aria-label="Build pages">
              <button
                className="build-page-button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                type="button"
                aria-label="Previous build page"
              >
                <span className="pagination-full-label">Prev</span>
                <span className="pagination-short-label">{"<"}</span>
              </button>
              {paginationItems.map((page) => (
                typeof page === "number" ? (
                  <button
                    key={page}
                    className={`build-page-button page-number ${currentPage === page ? "is-active" : ""}`}
                    onClick={() => goToPage(page)}
                    type="button"
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={page} className="build-page-ellipsis" aria-hidden="true">...</span>
                )
              ))}
              <button
                className="build-page-button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                type="button"
                aria-label="Next build page"
              >
                <span className="pagination-full-label">Next</span>
                <span className="pagination-short-label">{">"}</span>
              </button>
            </div>
          )}
        </>
      }
    </div>
  );
}

export default BuildList;
