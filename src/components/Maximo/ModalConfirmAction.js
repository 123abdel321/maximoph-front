import React from "react";

import PropTypes from 'prop-types'
import { Modal } from "reactstrap";

const ModalConfirmAction = props => {
    
    return (<Modal isOpen={props.confirmModal} backdrop={'static'} >
      <div className={"modal-header "+(props.error ? "error" : "system")}>
        <h5 className="modal-title text-white" id="staticBackdropLabel">{props.title}</h5>
        <button type="button" className="btn-close" onClick={()=>props.onClose()} aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <p>{props.description}</p>
      </div>
      <div className="modal-footer">
        {props.buttons}

        {props.information ? 
            (!props.buttons && (<button type="button" className="btn btn-secondary" onClick={()=>props.onClose()}>Ok</button>))
          :
            (<><button type="button" className="btn btn-primary" onClick={()=>props.onYes()}>Si</button>
             <button type="button" className="btn btn-light" onClick={()=>(props.onNo ? props.onNo() : props.onClose())}>No</button></>)
        }
      </div>
    </Modal>);
}

ModalConfirmAction.propTypes = {
  description: PropTypes.string,
  confirmModal: PropTypes.bool,
  information: PropTypes.bool,
  title: PropTypes.string,
  onClose: PropTypes.func,
  onYes: PropTypes.func,
  onNo: PropTypes.func
}

export default ModalConfirmAction;
