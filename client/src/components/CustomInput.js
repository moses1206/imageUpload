import React from 'react'

export default function CustomInput({ label, value, setValue, type = 'text' }) {
  return (
    <div>
      <div>
        <label>{label}</label>
        <input
          style={{ width: '100%' }}
          value={value}
          type={type}
          onChange={(e) => {
            setValue(e.target.value)
          }}
        />
      </div>
    </div>
  )
}
