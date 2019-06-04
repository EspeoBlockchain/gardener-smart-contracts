const { assert } = require('../utils');

const Authorizable = artifacts.require('Authorizable');

contract('Authorizable', (accounts) => {
  const sut = {};
  const validatingAccount = accounts[0];

  beforeEach(async () => {
    sut.instance = await Authorizable.new();
  });

  it('should grant authorized_role to account', async () => {
    // when
    await sut.instance.grantAccessToAddress(validatingAccount);

    // then
    const isGranted = await sut.instance.isAuthorized(validatingAccount);
    assert.isTrue(isGranted);
  });

  it('should revoke authorized_role from account', async () => {
    // given
    await sut.instance.grantAccessToAddress(validatingAccount);

    // when
    await sut.instance.revokeAccessFromAddress(validatingAccount);

    // then
    const isGranted = await sut.instance.isAuthorized(validatingAccount);
    assert.isFalse(isGranted);
  });
});
