"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  
  $allStoriesList.show();
}

/** Function to add a new story to storyList; R
 * 
 */
async function submitStory() {
  const $addedStory = 
    {
      title : $("#create-title").val(),
      author: $("#create-author").val(),
      url   : $("#create-url").val()
    }
  const story = await storyList.addStory(currentUser, $addedStory);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
}

/** Function to show UI favorite status of a post; R
 * 
 */
function getStarHTML(story, user) {   // ; R
  const isFavorite = user.isFavorite(story);
  const starFill = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="fa-star ${starFill}"></i>
      </span>`;
}

/** Function to fill out the favorites list; R
 * 
 */
function fillFavoritesPage() {   // R
  $favStoriesList.empty();

  for(let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favStoriesList.append($story);
  }
}

/** Function to fill out the user's stories list; R
 * 
 */
function fillMyStoriesPage() {    // R
  $myStoriesList.empty();
  for(let story of currentUser.ownStories) {
    let $story = generateStoryMarkup(story, true);
    $myStoriesList.append($story);
  }
}

/** Function to toggle UI favorite status of a post; R
 * - evt: click event
 */
async function toggleStoryFavorite(evt) {   // R
  console.debug("toggleStoryFavorite");

  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($target.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else if ($target.hasClass("far")){
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$(".stories-list").on("click", ".star", toggleStoryFavorite);   // On click listener for toggleStoryFavorite(evt); R

/** Function to show UI delete button on a post; R
 * 
 */
function getDeleteBtnHTML() {   // R
  return `
      <span class="trash">
        <i class="fa-trash-alt fas"></i>
      </span>`;
}

/** Function to show delete a user's post when trash can is clicked; R
 * - evt: click event
 */
async function deleteStory(evt) {   // R
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  console.log(storyId);

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await fillMyStoriesPage();
}

$myStoriesList.on("click", ".trash", deleteStory);   // On click listener for deleteStory(evt); R