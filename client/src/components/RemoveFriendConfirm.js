
import { Modal } from 'flowbite-react'
import { getUser, removeFriend } from '../services/api';


export default function RemoveFriendConfirm(props) {
    const {curUser, setCurUser, showConfirm, closeModal, unfriended} = props;

    const handleUnfriend = () => {
        console.log("unfriended called: ", unfriended);
        if (unfriended) {
          removeFriend(curUser._id, unfriended._id).then((res) => {
              console.log("response: ", res);
              if (res.status === 201 || res.status === 200) {
                  setCurUser(res.data.data);
              } else {
                console.log('Could not unfriend user ' + unfriended.name);
              }
          });
        }
        closeModal();
      }
    
    return (
        <Modal
        show={showConfirm}
        onClose={() => closeModal()}
    >
        <Modal.Header>Confirm remove friend </Modal.Header>
        <Modal.Body>
        <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                Are you sure you'd like to remove this friend? 
            </p>
        </div>
        </Modal.Body>
        <Modal.Footer>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleUnfriend}>
            Remove friend
        </button>
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => closeModal()}>
            Cancel
        </button>
        </Modal.Footer>
    </Modal>
)
}