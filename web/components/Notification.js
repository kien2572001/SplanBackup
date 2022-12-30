import { Button, notification } from 'antd';
import 'antd/dist/antd.css';

const openNotification = (props) => {
  let key = props.key;
  if(!props.key) {
    key = `open${Date.now()}`;
  }
  notification.open({
    type: props.type,
    message: props.title,
    description: props.description,
    key,
    duration: props.duration || 2,
  });
};

const Notification = (props) => (
  <Button type="primary" onClick={() => openNotification(props)}>
    {props.content}
  </Button>
);
  
export default Notification;
export const showNotification = (props) => openNotification(props);