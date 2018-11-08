const { assert } = require('../utils');

const Authorizable = artifacts.require('Authorizable');

contract('Authorizable', (accounts) => {
  const sut = {};
  const AUTHORIZED_USER_FLAG = 'authorized_user';
  const validatingAccount = accounts[0];

  beforeEach(async () => {
    sut.instance = await Authorizable.new();
  });

  it('should grant authorized_user to account', async () => {
    // when
    await sut.instance.grantAccessToAddress(validatingAccount);

    // then
    const isGranted = await sut.instance.hasRole(validatingAccount, AUTHORIZED_USER_FLAG);
    assert.isTrue(isGranted);
  });

  it('should revoke authorized_user from account', async () => {
    // given
    await sut.instance.grantAccessToAddress(validatingAccount);

    // when
    await sut.instance.revokeAccessFromAddress(validatingAccount);

    // then
    const isGranted = await sut.instance.hasRole(validatingAccount, AUTHORIZED_USER_FLAG);
    assert.isFalse(isGranted);
  });
});
