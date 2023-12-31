import React, { useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../Styles/Dashboard.css';
export default function Dashboard({ onEditPage }) {
  const handleEdit = (pageData) => {
    onEditPage(pageData);
    navigate("/EditPage");
  };

  const navigate = useNavigate();
  const { user, pages, getAllPages } = useContext(AuthContext);

  const handleDelete = async (pageid) => {
    // Show a confirmation alert before proceeding with the deletion
    const confirmed = window.confirm(
      "Are you sure you want to delete this page?"
    );

    if (confirmed) {
      try {
        // Send a DELETE request to the backend API endpoint
        const response = await fetch(
          `http://127.0.0.1:8000/webpages/delete/${pageid}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const responseData = await response.json();

          if (responseData.detail === "Page deleted") {
            // Page deleted successfully
            alert("Page deleted successfully");
            window.location.reload(); // Refresh the page to show updated data
          } else {
            // Error deleting the page
            console.error("Failed to delete the page.");
          }
        } else {
          // Error deleting the page
          console.error("Failed to delete the page.");
        }
      } catch (error) {
        console.error("An error occurred while deleting the page.", error);
      }
    }
  };

  useEffect(() => {
    getAllPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user ? (
      <>
      <h1 className='dashboard-heading mb-4'>Dashboard</h1>
    <div className=" dashboard-container">
      {pages.map((element, index) => {
        return (
          <div className="dashboard-card" key={index}>
            <div className="mx-2">
             
                <div className="card-body">
                  <h4 className="dash-title">
                    {index + 1} - {pages[index].title}
                    {/* <span className="float-end">
                      (Page ID - {pages[index].id})
                    </span> */}
                  </h4>
                 <div className="dashbtns">
                
                  <button
                    className="btn  mx-1"
                    onClick={() =>
                      handleEdit({
                        id: pages[index].id,
                        title: pages[index].title,
                        html_content: pages[index].html_content,
                        css_content: pages[index].css_content,
                      })
                    }
                    >
                    Edit
                  </button>
                  <button
                    className="btn  mx-1"
                    onClick={() => handleDelete(pages[index].id)}
                    >
                    Delete
                  </button>
                 </div>
                </div>
              </div>
            </div>
         
        );
      })}
    </div>
</>
  ) : (
    <div>
      <p>You are not logged in.</p>
    </div>
  );
}
