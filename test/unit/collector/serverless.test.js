'use strict'

const nock = require('nock')
const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const helper = require('../../lib/agent_helper')
const API = require('../../../lib/collector/serverless')
const serverfulAPI = require('../../../lib/collector/api')

describe('ServerlessCollector API', () => {
  let api = null
  let agent = null

  beforeEach(() => {
    nock.disableNetConnect()
    agent = helper.loadMockedAgent({
      serverless_mode: {
        enabled: true
      },
      app_name: ['TEST'],
      license_key: 'license key here'
    })
    agent.reconfigure = () => {}
    agent.setState = () => {}
    api = new API(agent)
  })

  afterEach(() => {
    nock.enableNetConnect()
    helper.unloadAgent(agent)
  })

  it('has all expected methods shared with the serverful API', () => {
    const serverfulSpecificPublicMethods = new Set([
      'connect',
      'reportSettings'
    ])

    const sharedMethods = Object.keys(serverfulAPI.prototype).filter((key) => {
      return !key.startsWith('_') && !serverfulSpecificPublicMethods.has(key)
    })

    sharedMethods.forEach((method) => {
      expect(API.prototype[method]).to.be.a('function')
    })
  })

  describe('#isConnected', () => {
    it('returns true', () => {
      expect(api.isConnected()).to.equal(true) // tada
    })
  })

  describe('#shutdown', () => {
    it('sets enabled to false', (done) => {
      expect(api.enabled).to.equal(true)
      api.shutdown(() => {
        expect(api.enabled).to.equal(false)
        done()
      })
    })
  })

  describe('#metricData', () => {
    it('adds metric_data to the payload object', (done) => {
      const metricData = {type: 'metric_data'}
      api.metricData(metricData, () => {
        expect(api.payload.metric_data).to.deep.equal(metricData)
        done()
      })
    })
  })

  describe('#errorData', () => {
    it('adds error_data to the payload object', (done) => {
      const errorData = {type: 'error_data'}
      api.errorData(errorData, () => {
        expect(api.payload.error_data).to.deep.equal(errorData)
        done()
      })
    })
  })

  describe('#transactionSampleData', () => {
    it('adds transaction_sample_data to the payload object', (done) => {
      const transactionSampleData = {type: 'transaction_sample_data'}
      api.transactionSampleData(transactionSampleData, () => {
        expect(api.payload.transaction_sample_data).to.deep.equal(transactionSampleData)
        done()
      })
    })
  })

  describe('#analyticsEvents', () => {
    it('adds analytic_event_data to the payload object', (done) => {
      const analyticsEvents = {type: 'analytic_event_data'}
      api.analyticsEvents(analyticsEvents, () => {
        expect(api.payload.analytic_event_data).to.deep.equal(analyticsEvents)
        done()
      })
    })
  })

  describe('#customEvents', () => {
    it('adds custom_event_data to the payload object', (done) => {
      const customEvents = {type: 'custom_event_data'}
      api.customEvents(customEvents, () => {
        expect(api.payload.custom_event_data).to.deep.equal(customEvents)
        done()
      })
    })
  })

  describe('#errorEvents', () => {
    it('adds error_event_data to the payload object', (done) => {
      const errorEvents = {type: 'error_event_data'}
      api.errorEvents(errorEvents, () => {
        expect(api.payload.error_event_data).to.deep.equal(errorEvents)
        done()
      })
    })
  })

  describe('#spanEvents', () => {
    it('adds span_event_data to the payload object', (done) => {
      const spanEvents = {type: 'span_event_data'}
      api.spanEvents(spanEvents, () => {
        expect(api.payload.span_event_data).to.deep.equal(spanEvents)
        done()
      })
    })
  })

  describe('#flushPayload', () => {
    let logStub = null

    before(() => {
      logStub = sinon.stub(process.stdout, 'write').callsFake(() => {})
    })

    after(() => {
      logStub.restore()
    })

    it('compresses full payload and writes formatted to stdout', (done) => {
      api.payload = {type: 'test payload'}
      api.flushPayload(() => {
        const logPayload = JSON.parse(logStub.args[0][0])
        expect(logPayload).to.be.an('array')
        expect(logPayload[0]).to.be.a('number')
        expect(logPayload[1]).to.equal('NR_LAMBDA_MONITORING')
        expect(logPayload[2]).to.be.a('string')
        done()
      })
    })
  })
})
