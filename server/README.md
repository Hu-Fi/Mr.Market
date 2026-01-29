## Mixin Bot

The backend server for Mr.market on Mixin.

## Getting Started

### Prerequisites

Install dependencies with bun

```
bun install
```

### Run development server

```
bun start
```

## Snapshot Processing

- `SnapshotsProcessor.pollSnapshotsCron()` runs every 3 seconds (cron) when `strategy.mixin_snapshots_run` is true.
- `SnapshotsService.fetchSnapshots()` reads the `snapshots:cursor`, filters new snapshots, updates the cursor, and records `snapshots:last_poll`.
- New snapshots are enqueued as `process_snapshot` jobs for per-snapshot handling.
- `SnapshotsProcessor.handleProcessSnapshot()` calls `SnapshotsService.handleSnapshot()` to decode memos, refund invalid/unsupported snapshots, and enqueue `process_mm_snapshot` for market-making.

## Tests

TBD

## Built With

- [Nest.js](https://nestjs.com/) - Backend API framework

## Contributing

Please read [CONTRIBUTING.md]() for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the GNU Affero General Public License - see the [LICENSE.md](../LICENSE) file for details
