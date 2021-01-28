import * as script from '../callScript'

describe('encodeCallScript', () => {
  const callScript = script.encodeCallScript([
    {
      to: '0xcafe1a77e84698c83ca8931f54a755176ef75f2c',
      data: '0xcafe',
    },
    {
      to: '0xbeefbeef03c7e5a1c29e0aa675f8e16aee0a5fad',
      data: '0xbeef',
    },
    {
      to: '0xbaaabaaa03c7e5a1c29e0aa675f8e16aee0a5fad',
      data: '0x',
    },
  ])

  test('callscript should start with script ID 1', () => {
    expect(callScript.slice(0, 10)).toBe(script.CALLSCRIPT_ID)
  })

  test('first part of callscript should be address for tx 1', () => {
    expect(callScript.slice(10, 50)).toBe(
      'cafe1a77e84698c83ca8931f54a755176ef75f2c'
    )
  })

  test('second part of callscript should be data length for tx 1', () => {
    expect(callScript.slice(50, 58)).toBe('00000002')
  })

  test('third part of callscript should be data for tx 1', () => {
    expect(callScript.slice(58, 62)).toBe('cafe')
  })

  test('fourth part of callscript should be address for tx 2', () => {
    expect(callScript.slice(62, 102)).toBe(
      'beefbeef03c7e5a1c29e0aa675f8e16aee0a5fad'
    )
  })

  test('fifth part of callscript should be data length for tx 2', () => {
    expect(callScript.slice(102, 110)).toBe('00000002')
  })

  test('sixth part of callscript should be data for tx 2', () => {
    expect(callScript.slice(110, 114)).toBe('beef')
  })

  test('seventh part of callscript should be address for tx 3', () => {
    expect(callScript.slice(114, 154)).toBe(
      'baaabaaa03c7e5a1c29e0aa675f8e16aee0a5fad'
    )
  })

  test('eigth part of callscript should be data length for tx 3', () => {
    expect(callScript.slice(154, 162)).toBe('00000000')
  })
})
