import React from 'react';

export default function Card({ task, children }) {
  return (
    <>
      <div id="kanban">
        <div className="card dx-card dx-theme-text-color dx-theme-background-color">
          <div className={`card-priority priority-3`}></div>
          <div className="card-subject">{children}</div>
          <div className="card-assignee">
            {/* {children} */}
          </div>
        </div>
      </div>
    </>
  )
}
