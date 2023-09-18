const token = {
  headers: {
  'X-Ap-Token': '6a746132-7823-4842-9d3e-ad90242cb8e6',
  'X-Ap-CompanyId': sessionStorage.getItem('CompanyId'),
  'X-Ap-UserId': sessionStorage.getItem('UserId'),
  }
}; 

export default token;