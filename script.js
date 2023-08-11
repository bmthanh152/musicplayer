const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


//Lấy ra các element chung
const mainName = $('header h2');
const mainSinger = $('header p');
const cdThumb = $('.cd-thumb');
const subName = $('.song-info-content b');
const subSinger = $('.song-info-content p');
const subImg = $('.song-info img');
const audio = $('#audio');
const container = $('#container');
const playBtn =  $('.btn-toggle-play');
const progress = $('#progress')
const playBackCurrent = $('p.playback-current');
const playBackDuration = $('p.playback-duration');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const sound = $('#volume');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isMuted: false,
 
    songs: [
        {
            name: 'Không còn em',
            singer: 'madihu',
            path: './assets/music/song1.mp3',
            image: './assets/image/song1.jpg'
        },
        {
            name: 'Em là',
            singer: 'Mono',
            path: './assets/music/song2.mp3',
            image: './assets/image/song2.jpg'
        },
        {
            name: 'Nụ hôn bisou',
            singer: 'Mikelodic',
            path: './assets/music/song3.mp3',
            image: './assets/image/song3.jpg'
        },
        {
            name: 'Trước khi em tồn tại',
            singer: 'Việt Anh',
            path: './assets/music/song4.mp3',
            image: './assets/image/song4.jpg'
        },
        {
            name: 'id 072019 | 3107',
            singer: 'W/n ft 267',
            path: './assets/music/song5.mp3',
            image: './assets/image/song5.jpg'
        },
        {
            name: 'Anh là ai',
            singer: 'DT & Huỳnh Công Hiếu',
            path: './assets/music/song6.mp3',
            image: './assets/image/song6.jpg'
        },
        {
            name: 'Ngủ một mình',
            singer: 'HIEUTHUHAI ft prod.kewtie',
            path: './assets/music/song7.mp3',
            image: './assets/image/song7.jpg'
        },
        {
            name: 'Mamma Mia',
            singer: 'HURRYKNG, REX, HIEUTHUHAI, Negav, MANBO',
            path: './assets/music/song8.mp3',
            image: './assets/image/song8.jpg'
        },
        {
            name: 'Không thể say',
            singer: 'HIEUTHUHAI',
            path: './assets/music/song9.mp3',
            image: './assets/image/song9.jpg'
        },
        {
            name: 'Đoạn kết mới',
            singer: 'Hoàng Dũng',
            path: './assets/music/song10.mp3',
            image: './assets/image/song10.jpg'
        },
    ],
    
    render: function(){
        const htmls = this.songs.map( (song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
          `
        });
        $('.playlist').innerHTML = htmls.join('');
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },



    //Xử lý sự kiện
    handleEvents: function(){
        const _this = this;
        //Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause();
        

        //xử lý nút play và pause
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
            
            audio.onplay = function() {
                _this.isPlaying = true;
                playBtn.classList.add('playing');
                cdThumbAnimate.play();
            }
            
            audio.onpause = function() {
                _this.isPlaying = false;
                playBtn.classList.remove('playing');
                cdThumbAnimate.pause();

            }
        }

        //Khi bài hát được chạy và xử lý thay đổi trên thanh thời lượng
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            
                playBackCurrent.textContent = timeFormat(audio.currentTime);
                playBackDuration.textContent = timeFormat(audio.duration);
                //update thời gian
                function timeFormat(seconds) {
                    let minute = Math.floor(seconds / 60);
                    let second = Math.floor(seconds % 60);
                    minute = minute < 10 ? "0" + minute : minute;
                    second = second < 10 ? "0" + second : second;
                    return minute + ":" + second;
                }
                
            }
        }

        //Tăng giảm âm lượng
        sound.oninput = function(e) {
            audio.volume = e.target.value
        }

        //Xử lý khi tua bài hát
        progress.onchange = function(e) {
            const seekTime =  e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        //Khi nhấn nút next
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.loadToActiveSong();
        }

        //Khi nhấn nút prev
        prevBtn.onclick = function(){
            _this.prevSong();
            audio.play();
            _this.render();
            _this.loadToActiveSong();
        }

        //Khi nhấn nút random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active');
            
        }

        //Khi nhấn nút replay
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active');
        }

        //Khi kết thúc bài hát
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }

        // Lựa chọn và phát khi click bài hát trên thanh menu
        playlist.onclick = function(e) {
            const songElement = e.target.closest('.song:not(.active)');
            if( songElement  || e.target.closest('.option')){
                //Xử lý click vào bài hát
                if(songElement){
                    _this.currentIndex = Number(songElement.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                    playBtn.classList.add('playing');
                }
                //xử lý click vào option
                if(e.target.closest('.option')){

                }
            }
        }
    },
    
    
    //Tải bài hát hiện tại
    loadCurrentSong: function(){
        mainName.textContent = this.currentSong.name;
        mainSinger.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        container.style.backgroundImage = `url('${this.currentSong.image}')`;
        subName.textContent = this.currentSong.name;
        subSinger.textContent = this.currentSong.singer;
        subImg.src = this.currentSong.image;
        audio.src = this.currentSong.path;
    },

    //Đưa active song lên view
    loadToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        },500)
    },


    //Khi ấn next song
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    //Khi ấn prev song
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length;
        }
        this.loadCurrentSong();
    },
    //Xử lý random song
    randomSong: function() {
        let randomNumberSong
        do{
            randomNumberSong = Math.floor(Math.random() * this.songs.length);
        }  while(randomNumberSong == this.currentIndex)
        this.currentIndex = randomNumberSong;
        this.loadCurrentSong();
    },



    //Xử lý next/prev bài hát
    start: function(){

        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe và xử lý các sự ki
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên khi chạy ứng dụng
        this.loadCurrentSong();

        //Render lại toàn bộ list nhạc
        this.render();
    }
}


app.start();