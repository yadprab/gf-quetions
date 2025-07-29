import './SidebarCards.css';

export function SidebarCards() {
  return (
    <div className="sidebar1">
      <div className="card">
        <h3 className="card-title">Recent Activity</h3>
        <ul className="card-list">
          <li className="card-item">
            <div className="text-left">
              <span className="green">Payment received</span>
              <span>Acme Corp • $15,000</span>
            </div>
            <div className="text-right">2 min ago</div>
          </li>
          <li className="card-item">
            <div className="text-left">
              <span className="red">Invoice disputed</span>
              <span>TechFlow Ltd • $8,500</span>
            </div>
            <div className="text-right">15 min ago</div>
          </li>
          <li className="card-item">
            <div className="text-left">
              <span className="blue">Follow-up sent</span>
              <span>DataSync Inc • $12,000</span>
            </div>
            <div className="text-right">45 min ago</div>
          </li>
          <li className="card-item">
            <div className="text-left">
              <span className="gray">Status updated</span>
              <span>CloudBridge • $18,500</span>
            </div>
            <div className="text-right">1 hour ago</div>
          </li>
        </ul>
      </div>

      <div className="card">
        <h3 className="card-title">Priority Actions</h3>
        <ul className="card-list">
          <li className="card-item">
            <div className="text-left">
              <span>Follow up on overdue invoices</span>
              <span>7 pending</span>
            </div>
            <div className="text-right"><span className="dot red"></span></div>
          </li>
          <li className="card-item">
            <div className="text-left">
              <span>Process dispute resolutions</span>
              <span>3 pending</span>
            </div>
            <div className="text-right"><span className="dot yellow"></span></div>
          </li>
          <li className="card-item">
            <div className="text-left">
              <span>Send payment reminders</span>
              <span>12 clients</span>
            </div>
            <div className="text-right"><span className="dot green"></span></div>
          </li>
        </ul>
      </div>
    </div>
  );
}
