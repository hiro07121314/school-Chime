var scheduledMusics = []; // スケジュールされた音楽のリスト

function scheduleMusic() {
  var timeInput = document.getElementById('time').value;
  var scheduledMusicList = document.getElementById('scheduled-music-list');
  var musicFile = document.getElementById('music').files[0];

  // 時間の書式をチェック
  if (timeInput === "") {
    alert("再生時間を選択してください");
    return;
  }

  // 時間の設定
  var scheduledTime = new Date();
  var hoursAndMinutes = timeInput.split(":");
  scheduledTime.setHours(parseInt(hoursAndMinutes[0]));
  scheduledTime.setMinutes(parseInt(hoursAndMinutes[1]));

  // 現在時刻を取得
  var currentTime = new Date();

  // スケジュールされた時間が現在時刻よりも前の場合、明日の同じ時間にセットする
  if (scheduledTime < currentTime) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  // スケジュールされた音楽を表示
  var listItem = document.createElement('li');
  listItem.textContent = "時間: " + timeInput + ", 音楽: " + musicFile.name;
  var cancelBtn = document.createElement('button');
  cancelBtn.textContent = "キャンセル";
  cancelBtn.onclick = function() {
    cancelSchedule(scheduledTime);
  };
  listItem.appendChild(cancelBtn);
  scheduledMusicList.appendChild(listItem);

  // スケジュールされた音楽を保持
  var scheduledMusic = setTimeout(function() {
    playMusic(musicFile);
    // 再生後、リストから削除
    var index = scheduledMusics.findIndex(function(item) {
      return item.time.getTime() === scheduledTime.getTime();
    });
    if (index !== -1) {
      scheduledMusics.splice(index, 1);
      scheduledMusicList.removeChild(listItem);
    }
  }, scheduledTime - currentTime);
  scheduledMusics.push({time: scheduledTime, timeoutID: scheduledMusic});
}

function playMusic(musicFile) {
  var audioPlayer = document.getElementById('audioPlayer');

  // 音楽の再生
  audioPlayer.src = URL.createObjectURL(musicFile);
  audioPlayer.play();
}

function cancelSchedule(cancelledTime) {
  var indexToRemove = scheduledMusics.findIndex(function(scheduledMusic) {
    return scheduledMusic.time.getTime() === cancelledTime.getTime();
  });

  // スケジュールされた音楽のリストから削除
  if (indexToRemove !== -1) {
    clearTimeout(scheduledMusics[indexToRemove].timeoutID);
    scheduledMusics.splice(indexToRemove, 1);
    var scheduledMusicList = document.getElementById('scheduled-music-list');
    scheduledMusicList.removeChild(scheduledMusicList.children[indexToRemove]);
  } else {
    alert("キャンセルするスケジュールが見つかりません");
  }
}
