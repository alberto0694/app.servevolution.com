import React from 'react';

export default function Card({ task, children, onClick }) {
  return (
    <>
      <div id="kanban">
        <div onClick={onClick} className="card dx-card dx-theme-text-color dx-theme-background-color">
          <div className={`card-priority priority-${task.status}`}></div>
          <div className="card-subject">{children}</div>
          <div className="card-assignee">
            {/* {children} */}
          </div>
        </div>
      </div>
    </>
  )
}
