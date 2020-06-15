import React from 'react';

// SocketContext = {Provider, Consumer}
const SocketContext = React.createContext(null); 

export class SocketProvider extends React.Component {

    render() {

        return (
            <SocketContext.Provider value={this.props.socket}>
                {this.props.children}
            </SocketContext.Provider>
        );
    }
}

export function withSocketContext(Component) {
    class ComponentWithSocket extends React.Component {
        static displayName = `${Component.displayName ||
          Component.name}`;


        render() {
            return (
                <SocketContext.Consumer>
                    { socket =>  <Component {...this.props}  socket={socket} ref={this.props.onRef} /> }
                </SocketContext.Consumer>
            );
        }
    }
    
    return ComponentWithSocket;
}