import React, { useState } from "react";

const InsulationPerformance = ({ data, onDataChange, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    wallType: data.wallType || "",
    externalWallInsulation: data.externalWallInsulation || "",
    roofInsulation: data.roofInsulation || "",
    windowType: data.windowType || "",
    floorInsulation: data.floorInsulation || "",
    ...data
  });

  // Help modal state
  const [activeHelpModal, setActiveHelpModal] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...formData,
      [name]: value
    };
    setFormData(updatedData);
    onDataChange({ [name]: value });
  };

  const openHelpModal = (modalType) => {
    setActiveHelpModal(modalType);
  };

  const closeHelpModal = () => {
    setActiveHelpModal(null);
  };

  // Validation function
  const isFormValid = () => {
    return formData.wallType && 
           formData.externalWallInsulation && 
           formData.roofInsulation && 
           formData.windowType && 
           formData.floorInsulation;
  };

  return (
    <div className="step-container insulation-performance-step">
      <div className="step-header">
        <h2>Insulation Performance</h2>
        <p className="step-description">Tell us about your home's insulation and construction details to calculate accurate energy efficiency and heating requirements.</p>
        <p className="step-description epc-hint">You can find most of these information in your property's Energy Performance Certificate (EPC). <a href="https://www.gov.uk/find-energy-certificate" target="_blank" rel="noopener noreferrer">Find your EPC here</a>.</p>
      </div>

      <div className="insulation-form-container">
        <div className="form-section">
          <div className="form-group">
            <div className="form-label-with-help">
              <label htmlFor="wallType">Wall Type</label>
              <button 
                type="button"
                className="field-help-btn"
                onClick={() => openHelpModal('wallType')}
                aria-label="Wall Type Help"
              >
                ?
              </button>
            </div>
            <select
              id="wallType"
              name="wallType"
              value={formData.wallType}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select wall type</option>
              <option value="brick">Brick</option>
              <option value="cavity-insulated">Cavity (with insulation)</option>
              <option value="cavity-uninsulated">Cavity (without insulation)</option>
              <option value="stone">Stone</option>
              <option value="modern">Modern (if unsure, choose this)</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <div className="form-label-with-help">
              <label htmlFor="externalWallInsulation">External Wall Insulation</label>
              <button 
                type="button"
                className="field-help-btn"
                onClick={() => openHelpModal('externalWallInsulation')}
                aria-label="External Wall Insulation Help"
              >
                ?
              </button>
            </div>
            <select
              id="externalWallInsulation"
              name="externalWallInsulation"
              value={formData.externalWallInsulation}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select external wall insulation</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="uncertain">Uncertain</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <div className="form-label-with-help">
              <label htmlFor="roofInsulation">Roof Insulation</label>
              <button 
                type="button"
                className="field-help-btn"
                onClick={() => openHelpModal('roofInsulation')}
                aria-label="Roof Insulation Help"
              >
                ?
              </button>
            </div>
            <select
              id="roofInsulation"
              name="roofInsulation"
              value={formData.roofInsulation}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select roof insulation</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="uncertain">Uncertain</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <div className="form-label-with-help">
              <label htmlFor="windowType">Window Type</label>
              <button 
                type="button"
                className="field-help-btn"
                onClick={() => openHelpModal('windowType')}
                aria-label="Window Type Help"
              >
                ?
              </button>
            </div>
            <select
              id="windowType"
              name="windowType"
              value={formData.windowType}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select window type</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
              <option value="uncertain">Uncertain</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <div className="form-label-with-help">
              <label htmlFor="floorInsulation">Floor Insulation</label>
              <button 
                type="button"
                className="field-help-btn"
                onClick={() => openHelpModal('floorInsulation')}
                aria-label="Floor Insulation Help"
              >
                ?
              </button>
            </div>
            <select
              id="floorInsulation"
              name="floorInsulation"
              value={formData.floorInsulation}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select floor insulation</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="uncertain">Uncertain</option>
            </select>
          </div>
        </div>


      </div>

      <div className="button-group">
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onBack}
        >
          Back to Roof Condition
        </button>
        <button 
          type="button" 
          className={`btn btn-primary ${!isFormValid() ? 'disabled' : ''}`}
          onClick={onNext}
          disabled={!isFormValid()}
        >
          Next: Energy Demand
        </button>
      </div>

      {/* Help Modals */}
      {activeHelpModal === 'wallType' && (
        <div className="field-help-overlay" onClick={closeHelpModal}>
          <div className="field-help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="field-help-header">
              <h3>Wall Type Guide</h3>
              <button className="field-help-close-btn" onClick={closeHelpModal} aria-label="Close help">×</button>
            </div>
            <div className="field-help-content">
              <p><strong>Choose the option that best describes your property's main wall construction:</strong></p>
              <p><strong>Brick:</strong> Traditional solid brick walls, common in properties built before 1920. Single layer of brick with no cavity.</p>
              <p><strong>Cavity (with insulation):</strong> Double-wall construction with an air gap between inner and outer walls, with insulation material installed between or over the joists.</p>
              <p><strong>Cavity (without insulation):</strong> Double-wall construction with an air gap between inner and outer walls, but no insulation material installed.</p>
              <p><strong>Stone:</strong> Natural stone construction, typically found in older properties or traditional builds in certain regions.</p>
              <p><strong>Modern (if unsure, choose this):</strong> Contemporary construction methods including timber frame, concrete block, or other modern materials (post-1980), or if you're unsure about your wall construction type.</p>
            </div>
          </div>
        </div>
      )}

      {activeHelpModal === 'externalWallInsulation' && (
        <div className="field-help-overlay" onClick={closeHelpModal}>
          <div className="field-help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="field-help-header">
              <h3>External Wall Insulation Guide</h3>
              <button className="field-help-close-btn" onClick={closeHelpModal} aria-label="Close help">×</button>
            </div>
            <div className="field-help-content">
              <p><strong>Does your property have external wall insulation?</strong></p>
              <p><strong>Yes:</strong> Your property has visible external insulation cladding, or you know that external wall insulation has been installed.</p>
              <p><strong>No:</strong> Your property does not have external wall insulation. The original wall surface is still visible.</p>
              <p><strong>Uncertain:</strong> You're not sure whether external wall insulation has been installed on your property.</p>
              <p><strong>What to look for:</strong> External wall insulation typically appears as a rendered or cladded surface that covers the original wall material. It may make your walls appear thicker than neighboring properties.</p>
            </div>
          </div>
        </div>
      )}

      {activeHelpModal === 'roofInsulation' && (
        <div className="field-help-overlay" onClick={closeHelpModal}>
          <div className="field-help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="field-help-header">
              <h3>Roof Insulation Guide</h3>
              <button className="field-help-close-btn" onClick={closeHelpModal} aria-label="Close help">×</button>
            </div>
            <div className="field-help-content">
              <p><strong>Does your property have roof/loft insulation?</strong></p>
              <p><strong>Yes:</strong> Your loft space has insulation material (such as mineral wool, foam boards, or other insulating materials) installed between or over the joists.</p>
              <p><strong>No:</strong> Your loft space has no insulation, or very minimal insulation (less than 100mm).</p>
              <p><strong>Uncertain:</strong> You haven't checked your loft space or are unsure about the presence or adequacy of insulation.</p>
              <p><strong>How to check:</strong> Look in your loft space for yellow, white, or grey fluffy material between the floor joists, or rigid boards attached to the roof structure.</p>
            </div>
          </div>
        </div>
      )}

      {activeHelpModal === 'windowType' && (
        <div className="field-help-overlay" onClick={closeHelpModal}>
          <div className="field-help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="field-help-header">
              <h3>Window Type Guide</h3>
              <button className="field-help-close-btn" onClick={closeHelpModal} aria-label="Close help">×</button>
            </div>
            <div className="field-help-content">
              <p><strong>What type of glazing do your windows have?</strong></p>
              <p><strong>Single:</strong> Single pane of glass in each window frame. Common in older properties, offers minimal thermal efficiency.</p>
              <p><strong>Double:</strong> Two panes of glass with an air or gas-filled gap between them. Standard in most modern properties, provides good thermal efficiency.</p>
              <p><strong>Triple:</strong> Three panes of glass with two air/gas-filled gaps. High-performance windows offering excellent thermal efficiency.</p>
              <p><strong>Uncertain:</strong> You're not sure what type of glazing your windows have.</p>
              <p><strong>How to tell:</strong> Count the number of glass reflections when you hold an object close to the window - you'll see one reflection per pane of glass.</p>
            </div>
          </div>
        </div>
      )}

      {activeHelpModal === 'floorInsulation' && (
        <div className="field-help-overlay" onClick={closeHelpModal}>
          <div className="field-help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="field-help-header">
              <h3>Floor Insulation Guide</h3>
              <button className="field-help-close-btn" onClick={closeHelpModal} aria-label="Close help">×</button>
            </div>
            <div className="field-help-content">
              <p><strong>Does your property have floor insulation?</strong></p>
              <p><strong>Yes:</strong> Your floors have insulation installed, either under suspended floors or within solid floor construction. Floors feel warm and comfortable.</p>
              <p><strong>No:</strong> Your floors have no insulation. Ground floors may feel cold, especially in winter.</p>
              <p><strong>Uncertain:</strong> You're not sure whether your floors have insulation installed.</p>
              <p><strong>Signs of floor insulation:</strong> Floors that stay warm, no drafts coming up through floorboards, or visible insulation material in basement/crawl space areas.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsulationPerformance; 