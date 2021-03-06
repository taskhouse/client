import request from './request'
import { struct } from 'superstruct'

const Employer = struct({
  id: 'number?',
  username: 'string',
  password: 'string?',
  email: 'string',
  firstName: 'string',
  lastName: 'string',
})

const Location = struct({
  id: 'number?',
  country: 'string',
  city: 'string',
  zipCode: 'number',
  primaryLine: 'string',
  secondaryLine: 'string?',
})

export default {
  /**
   * Get employer and if id is undefined you get all employers
   * @param {Number} id
   * @return {Promise}
   */
  async get(id) {
    const res = await request.get(id ? `employers/${id}` : 'employers')
    return await res.json()
  },

  /**
   * Create employer
   * @param {Object} employer
   * @return {Promise}
   */
  async create(employer, location) {
    //Validate data for the body
    Employer(employer);
    Location(location);
    const res = await request.post('employers', { user: employer, location, password: employer.password });
    return await res.json()
  },

  /**
   * Update employer
   * @param {Object} employer
   * @return {Promise}
   */
  async update(employer) {
    //Validate data for the body
    Employer(employer);
    const res = await request.put(`employers/${employer.id}`, employer);
    return res.ok
  },

  /**
   * Delete employer
   * @param {Number} id
   * @return {Promise}
   */
  async delete(id) {
    const res = await request.delete(`employers/${id}`);
    return res.ok
  },

  /**
   * Get all tasks of employer the id
   * @param {Number} id
   * @return {Promise}
   */
  async getTasks(id) {
    const res = await request.get(`employers/${id}/tasks`)
    return await res.json()
  },

  /**
   * Get accepted tasks for the employer with the id
   * @param {Number} id
   * @return {Promise}
   */
  async getAcceptedTasks(id) {
    const res = await request.get(`employers/${id}/tasks/accepted`)
    return await res.json()
  }
}
