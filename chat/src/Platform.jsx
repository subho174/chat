import React from 'react';
import ChatInterface from './ChatInterface'
import Panel from './Panel';

const Platform = () => {
  return (
    <div className='flex'>
        <Panel />
        <ChatInterface />
    </div>
  )
}

export default Platform