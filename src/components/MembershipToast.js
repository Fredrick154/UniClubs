import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showJoinSuccess = (clubName) => {
  toast.success(`✅ Successfully joined ${clubName}!`);
};

const MembershipToast = () => {
  return <ToastContainer position="bottom-right" autoClose={3000} />;
};

export default MembershipToast;