"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitStory(evt) {
  console.debug("updateSubmitStory", evt);
  navAllStories();
  $storyForm.show();
}

$body.on("click", "#nav-add-story", navSubmitStory);

function navPostStory(evt) {
  console.debug("updatePostStory", evt);
  submitStory();
  $storyForm.hide();
}

$(".stories-container").on("submit", navPostStory);

function navShowFavorites(evt) {
  console.debug("showFavorites", evt);
  hidePageComponents();
  fillFavoritesPage();
  $favStoriesList.show();
}

$navFavStories.on("click", navShowFavorites);

function navShowMyStories(evt) {
  console.debug("showMyStories", evt);
  hidePageComponents();
  fillMyStoriesPage()
  $myStoriesList.show();
}

$navMyStories.on("click", navShowMyStories);