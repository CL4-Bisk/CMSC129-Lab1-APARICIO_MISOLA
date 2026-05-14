import "./CalculatorSection.css";
import { useState } from "react";

function CalculatorSection( { setAppSections } ){
    const [setup, setNewSetup] = useState(["TestSetup"]);
    const [damageType, setDamageType] = useState(true);
    
    const [rawDamage, setRawDamage] = useState(100);
    const [totalPenetration, setTotalPenetration] = useState(0);
    const [totalPercentPenetration, setTotalPercentPenetration] = useState(0);

    const [totalDef, setTotalDef] = useState(100)

    const magicPenetrationItems = [
      { id: 1, name: 'Arcane boots', penetration: 45, percentage:false },
      { id: 2, name: 'Genius Wand', penetration: 45, percentage:false },
      { id: 3, name: 'Divine Glaive', penetration: 40 + Math.min(0.1 * totalDef, 20), percentage:true},
    ];

    const physicalPenetrationItems = [
      { id: 1, name: 'Hunter Strike', penetration: 15, percentage: false},
      { id: 3, name: 'Blade of the Heptaseas', penetration: 15, percentage: false},
      { id: 2, name: 'Maelefic Gun', penetration: 30, percentage: true},
      { id: 4, name: 'Maelefic Roar', penetration: 30 + Math.min(0.1 * totalDef, 30), percentage: true},
    ];

    function updateItems(e, penetration, percentage) {
      const isChecked = e.target.checked;
      if (percentage) {
        setTotalPercentPenetration(prevTotalPercentPenetration => isChecked ? prevTotalPercentPenetration + penetration : prevTotalPercentPenetration - penetration);
      } else {
        setTotalPenetration(prevTotalPenetration => isChecked ? prevTotalPenetration + penetration : prevTotalPenetration - penetration);
      }
    }

    function editSetup(){

    }

    function addSetup(){

    }

    return(
    <div>
      <div style={{width: "100%"}}>
          <h1>Calculate Damage</h1>
      </div>

      <div 
        className="damage-calculator" 
      >

        <button style={{width: "45%"}}
            onClick={() => 
              {setDamageType(!damageType);
              setTotalPercentPenetration(0);
              setTotalPenetration(0)}
            }
        >
            {damageType? "Physical damage" : "Magic Damage"}
        </button>

        <div>
            <input
                type="number"
                value={rawDamage}
                onChange={(e) => setRawDamage(Number(e.target.value))}/>
        </div>

        <div style={{ width: '50%' }}>
          <fieldset>
            <legend>{damageType ? "Physical" : "Magic"} Penetration</legend>
            {(damageType ? physicalPenetrationItems : magicPenetrationItems).map(item =>
            <div key={item.id}>
              <input 
                type="checkbox" 
                onChange={(e) => updateItems(e, item.penetration, item.percentage)}
              />
              <label>{item.name}</label>
            </div>
            )}
          </fieldset>
        </div>

        <div>
          <button className="history-button">
            See History
          </button>
          <button className="home-button" onClick={() => setAppSections("HOME")} type="button">
            Back to home
          </button>
        </div>

        <div>
          <button className="add-setup-button">
                Create new Defence Setup
          </button>
        </div>
        
        <div>
          <ol>
            {setup.map((setup, index) => 
                <li key={setup}>
                    <span className="text">{setup}</span>
                    <button
                        className="edit-setup-button"
                        onClick={() => editSetup(index)}>
                        Edit Setup
                    </button>
                    <button
                        className="add-setup-button"
                        onClick={() => addSetup(index)}>
                        Add Setup
                    </button>
                </li>
            )}
          </ol>
        </div>

        <div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#666" }}>
                Inflicted Damage:
            </p>
            <div className="damage-text">
                {console.log(totalDef)}
                {console.log(totalPercentPenetration)}
                {console.log(totalPenetration)}
                
                {Math.ceil(rawDamage * 120 / (120 + (totalDef - totalPenetration) * (1 - totalPercentPenetration / 100)))}
            </div>
        </div>
      </div>
    </div>);
}
export default CalculatorSection