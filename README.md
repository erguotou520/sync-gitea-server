# Sync Gitea Server

This project is a webhook server to help us to synchronize `Gitea` repository changes to our upstream repository.

When the upstream repository is updated, it send a webhook event to this server, and then the server call the `Gitea` API to synchronize the changes.

<!-- <table>
  <tr>
    <td>
      <img src="./assets/screen1.png" width="300" />
    </td>
    <td>
      <img src="./assets/notifications.png" width="300" />
    </td>
  </tr>
</table> -->

## How to Use


## Development

We use `bun` to develop this project, so you need to install it first:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Install dependencies

```bash 
bun install
```

### Run the server

```bash
cd packages/server
bun dev
```

### Run the web

```bash
cd packages/web
bun dev
```

## License

[MIT](./LICENSE)
