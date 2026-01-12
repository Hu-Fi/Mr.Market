## Docs
When creating docs, use English, keep it simple stupid, don't overcomplicate it, only write 1 doc for each feature, and make sure it's easy to understand. If have different docs for different topics, join them to a file.

When the code is updated, update the related docs as well.

Update docs/execution/CHANGELOG.md when the code is updated, keep the CHANGELOG.md simple, Keep each changes in one line.

## UI
use svelte-i18n when adding text, use $_ to access the text, en.json is the default language file.
use daisyui and tailwindcss for styling, use text-base-100 for white text and text-base-content for black text, use bg-base-100 for white background and bg-base-content for black background. 
use bg-base-content/60 or bg-base-300 for gray. 
avoid text-gray-900 or other custom color because it's bad for different theme support.
avoid using h1 h2 h3 and p for text, use span and tailwindcss classes for text size instead.
avoid using uppercase class for text, always use capitalize class instead.