// forside som viser daglige ting 
import Card from '../components/Card';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Card title="Habits">
        <p>Se dine aktive habits her.</p>
      </Card>
       {/*<Card title="To-Do's">
        <p>se dine rutiner her</p>
      </Card>

      <Card
        title="Daily routines"
        footer={<span>Sidst reset: Søndag kl. 00:00</span>}
      >
        <p>Hold styr på dine gentagne opgaver.</p>
      </Card>*/}


      <Card title="Statistik" className="stats">
        <p>Overblik over månedens fremskridt.</p>
      </Card>


    </div>
  );
}
