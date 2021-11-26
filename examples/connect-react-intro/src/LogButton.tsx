import React from 'react'

function LogButton({ value }: any) {
  return <button onClick={() => console.log(value)}>log()</button>
}

export default LogButton
