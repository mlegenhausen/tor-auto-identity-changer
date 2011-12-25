tor-auto-identity-changer
=========================

# Pre Requirements

 * curl
 * node

# Installation

```
git clone git@github.com:mlegenhausen/tor-auto-identity-changer.git
cd tor-auto-identity-changer
npm link
```

# Usage

```
tor-auto-identitiy-changer <password>
```

Make sure you have enabled the control port and hash authentication in the `torrc`.

Use `tor-auto-identity-changer --help` for further usage informations.

*Note:* You can use `MaxCircuitDirtiness` in the `torrc` for changing the usage time of a circuit.
