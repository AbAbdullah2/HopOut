import { Modal } from 'flowbite-react'
import { unsendInvite } from '../services/api';


export default function RemoveInviteeConfirm(props) {
    const {uninvited, event, setEvent, showConfirm, closeModal} = props;

    const handleRemove = () => {
        if (uninvited) {
            unsendInvite(event._id, uninvited._id).then((res) => {
              setEvent(res.data.data);
            });
        }
        closeModal();
      }
    
    return (
        <Modal
        show={showConfirm}
        onClose={() => closeModal()}
    >
        <Modal.Header>Confirm remove user from this event </Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Are you sure you'd like to remove this user? You will have to invite them again if you change your mind.
            </p>
        </div>
        </Modal.Body>
        <Modal.Footer>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleRemove}>
            Remove
        </button>
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => closeModal()}>
            Cancel
        </button>
        </Modal.Footer>
    </Modal>
)
}