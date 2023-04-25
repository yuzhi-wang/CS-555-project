import React, { useState, useEffect } from 'react';

function DisplayMessage({ messages }) {
  return (
    <div>
      {messages.map((message, index) => (
        message.role === 'customer' ? (
          // The one you sent
          <div class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end" key={index}>
            <div>
              <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                <p class="text-sm">{message.Text}</p>
              </div>
              <span class="text-xs text-gray-500 leading-none">{message.uid}</span>
            </div>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          </div>
        ) : (
          // The one you received
          <div class="flex w-full mt-2 space-x-3 max-w-xs" key={index}>
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
            <div>
              <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                <p class="text-sm">{message.Text}</p>
              </div>
              <span class="text-xs text-gray-500 leading-none">{message.uid}</span>
            </div>
          </div>
        )
      ))}
    </div>
  );
}

export default DisplayMessage;