# Syatt Front End Developer Assessment

## What this *is*

This assessment is meant to get an idea of your comfort level with the following:

* Performance.
* Accessibility.
* Valid and semantic HTML.
* Following best practices for BEM components.
* Jumping into existing projects.
* Identifying and following existing patterns and conventions.
* Code readability & maintainability.

## What this *is not*

**This assessment is not meant to trick you in any way.** There are no typos or other "gotchas" hidden deep in the html we expect you to find (If you find any, they are legitimate typos or mistakes, and by all means, feel free to fix :-)). When there is a portion of the html where there are no expected changes, we will note it in the source code. Along the same lines, if you spot an issue and improve it, but miss a similar issue somewhere else in the code, don't sweat it; you've demonstrated an understanding of the issue.

This assessment is also not meant to consume a significant amount of your time. Use whatever tools you want to help audit the page. If you're struggling with this particular setup or have something that already exists that demonstrates your comfort level with concepts noted above, by all means, reach out to us (brit.macintyre@syatt.io), and we can discuss that instead.
 
When it comes to code readability and maintainability, there generally is no strict "right" and "wrong," so changes related to this are simply a conversation starter.

## The Tasks

1. Improve the loading performance of assets (images, javascripts, and stylesheets). Be on the lookout for (but not limited to):
   * Cumulative layout shift
   * Render blocking resources
   * Largest contentful paint
   * Loading priority
   * Optimized image sizing
2. Improve the accessibility of the page. Be on the lookout for (but not limited to):
   * Use of semantic elements
   * Tab order and focus states
   * Heading levels
   * Accessible names on interactive elements
   * Use of accessibility attributes
3. Bug fix. The desktop navigation and mobile navigation are both showing at all viewport widths. They're using the proper `overrides` hidden classes, but they don't seem to be working.
4. Change request. Please adjust the `hero` so it's not full width. We want to be the same width as the `media-with-text` content sections below.
5. Fix any BEM component anti-patterns or breaks from convention.

## Dev Environment

This assessment is built using [Middleman](https://middlemanapp.com/basics/install/) purely for the ease of code organization. It is not expected that you optimize anything about this organization (though you're more than welcome to) or are even familiar with this tech stack. **What we're concerned about is the final, rendered HTML.**

On that note, below are some instructions to help you get started.

---

### Prerequisites

Before you begin, ensure you have the following installed:

1. **Ruby** (recommended version: 3.0 or higher)
   - You can check your Ruby version with:
     ```bash
     ruby -v
     ```
   - Install Ruby using a version manager like [RVM](https://rvm.io/) or [rbenv](https://github.com/rbenv/rbenv).

2. **Bundler** (Ruby dependency manager)
   - Check if you already have Bundler:
     ```bash
     bundler -v
     ```
   - If not, install it with:
     ```bash
     gem install bundler
     ```

---

### Installation

Install dependencies:
```bash
cd <repository-directory>
bundle install
```

### Start Development Server
```bash
bundle exec middleman server
```

### Troubleshooting
As mentioned, testing your proficiency in troubleshooting Ruby environments is not the intention of this assessment. If the tips below do not help, you could always view the static site in the `build` directory via a simple local server. One option I recommend is https://github.com/http-party/http-server.

1. **Ruby version issues:** Ensure you're using the correct Ruby version by running:
  ```bash
  rvm use <version>  # or rbenv set global <version>
  ```
2. **Dependency errors:** If `bundle install` fails, try updating Bundler:
  ```bash
  gem update bundler
  ```
3. **Middleman not found:** Ensure Middleman is installed:
  ```bash
  gem install middleman
  ```

---

## When you're done

Once you're comfortable with your changes, submit via email (brit.macintyre@syatt.io), either:

- Share a link to a GitHub repo (make sure it is public).
Or
- Send a zip the repo or `build` directory. You can create that by running `bundle exec middleman build`