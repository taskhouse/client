import request from './request'

export default {
  /**
   * Get list of all workers
   * @return {Promise}
   */
  async get() {
    const res = await request.get('workers');
    return await res.json();
  },
  async create (body){
   const res = await request.post('workers', body);
   return await res.json();
  }
}

