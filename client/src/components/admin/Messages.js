import React, { Component, Fragment } from 'react';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import { fetchMessages, deleteMessages } from '../../actions/messages';
import 'antd/dist/antd.css';

export class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      content: ''
    };
  }

  componentDidMount() {
    this.props.fetchMessages();
  }

  showModal = (content, email) => {
    this.setState({
      visible: true,
      content: content
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  renderMessages = () => {
    const { notifications } = this.props;
    return (
      notifications &&
      notifications.map((notification, index) => {
        return (
          <Fragment key={index}>
            <div
              className='dropdown-item d-flex align-items-center'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                this.showModal(notification.content, notification.email);
              }}
            >
              <div className='dropdown-list-image mr-3'>
                <img
                  className='rounded-circle'
                  src='https://source.unsplash.com/fn_BT9fwg_E/60x60'
                  alt=''
                />
                <div className='status-indicator bg-success'></div>
              </div>
              <div className='font-weight-bold'>
                <div className='text-truncate'>{notification.content}</div>

                <div className='small text-gray-500'>
                  <span>{notification.firstname}</span>
                </div>
              </div>
            </div>
          </Fragment>
        );
      })
    );
  };
  onDelete = () => {
    this.props.deleteMessages();
  };

  render() {
    const modalTitle = (
      <h4 class='d-flex justify-content-between align-items-center mb-3'>
        <span class='text-muted'>Message</span>
      </h4>
    );

    return (
      <Fragment>
        {this.renderMessages()}
        <div
          className='dropdown-item text-center small text-red-500'
          style={{ cursor: 'pointer' }}
          onClick={this.onDelete}
        >
          <span>
            <i class='fa fa-trash' aria-hidden='true'></i>
            Clear messages
          </span>
        </div>
        <Modal
          title={modalTitle}
          visible={this.state.visible}
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
          okText='Ok'
        >
          <div class='alert alert-primary' role='alert'>
            {this.state.content}
          </div>
        </Modal>
      </Fragment>
    );
  }
}
const mapStateToProps = state => {
  return {
    notifications: Object.values(state.notifications)
  };
};

export default connect(mapStateToProps, { fetchMessages, deleteMessages })(
  Messages
);
