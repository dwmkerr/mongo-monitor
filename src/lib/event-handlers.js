//  Event handlers for various mongo topology events. These can be used to
//  provide more data to the events shown to the user.
//  Only a few events are logged for now.
const eventHandlers = {

  // timeout: () => {
    // return 'timeout';
  // },

  close: () => {
    return 'close';
  },

  serverOpening: () => {
    return 'serverOpening';
  },

  // serverDescriptionChanged: () => {
    // return 'serverDescriptionChanged';
  // },

  // serverHeartbeatStarted: () => {
    // return 'serverHeartbeatStarted';
  // },

  // serverHeartbeatSucceeded: () => {
    // return 'serverHeartbeatSuceeded';
  // },

  // serverHeartbeatFailed: () => {
    // return 'serverHeartbeatFailed';
  // },

  serverClosed: () => {
    return 'serverClosed';
  },

  topologyOpening: () => {
    return 'topologyOpening';
  },

  topologyClosed: () => {
    return 'topologyClosed';
  },

  // topologyDescriptionChanged: () => {
    // return 'topologyDescriptionChanged';
  // },

  joined: () => {
    return 'joined';
  },

  left: () => {
    return 'left';
  },

  // ping: () => {
    // return 'ping';
  // },

  // ha: () => {
    // return 'ha';
  // },

  // all: () => {
    // return 'all';
  // },

  // fullsetup: () => {
    // return 'timeout';
  // },

};

module.exports = eventHandlers;
