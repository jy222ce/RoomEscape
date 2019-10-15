Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//////// Game Definition
function Game(){}
Game.start = function(room, welcome){
	game.start(room.id)
	printMessage(welcome)
}
Game.end = function(){
	game.clear()
}
Game.move = function(room){
	game.move(room.id)	
}
Game.handItem = function(){
	return game.getHandItem()
}

//////// Room Definition

function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})

//////// Object Definition

function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){
	this.id.show()
})
Object.member('hide', function(){
	this.id.hide()
})
Object.member('open', function(){
	this.id.open()
})
Object.member('close', function(){
	this.id.close()
})
Object.member('lock', function(){
	this.id.lock()
})
Object.member('unlock', function(){
	this.id.unlock()
})
Object.member('isOpened', function(){
	return this.id.isOpened()
})
Object.member('isClosed', function(){
	return this.id.isClosed()
})
Object.member('isLocked', function(){
	return this.id.isLocked()
})
Object.member('pick', function(){
	this.id.pick()
})
Object.member('isPicked', function(){
	return this.id.isPicked()
})

//////// Door Definition

function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
})
Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})


//////// Keypad Definition

function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback
}
// inherited from Object
Keypad.prototype = new Object()

Keypad.member('onClick', function(){
	showKeypad('number', this.password, this.callback)
})


//////// DoorLock Definition
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}
// inherited from Object
DoorLock.prototype = new Keypad()

/////// Item Definition

function Item(room, name, image){
	Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})
Item.member('isHanded', function(){
	return Game.handItem() == this.id
})






room1 = new Room('room1', '방배경.png')		// 변수명과 이름이 일치해야 한다.
room2 = new Room('room2', '배경-4.png')		// 변수명과 이름이 일치해야 한다.
room2.setRoomLight(0.5)
room3 = new Room('room3', '방배경3.png')		// 변수명과 이름이 일치해야 한다.

room1.door1 = new Door(room1, 'door1', '문-우-닫힘.png', '문-우-열림.png', room2)
room1.door1.resize(136)
room1.door1.locate(1049,270)
room1.door1.lock()

room1.carpet1 = new Object(room1, 'carpet1', '카펫1.png')
room1.carpet1.resize(430)
room1.carpet1.locate(820,600)
room1.carpet1.onClick=function(){
	printMessage("카펫 아래에는 아무 것도 없다.")
}

room1.sofa1=new Object(room1,'sofa1','소파.png')
room1.sofa1.resize(700)
room1.sofa1.locate(490,380)
room1.sofa1.onClick=function(){
	printMessage("소파 밑에 무언가가 있는것 같다.")
}

room1.memo1=new Object(room1,'memo1','포스트잇.png')
room1.memo1.resize(50)
room1.memo1.locate(600,450)
room1.memo1.onClick=function(){
	showImageViewer("달력.png")
	printMessage("종이에 달력이 그려져 있고 무언가 표시되어 있다.")
}

room1.keypad0 = new Keypad(room1, 'keypad0', '숫자키-좌.png', '0526', function(){
	room1.cabinet1.unlock()
	printMessage('잠금장치가 열렸다!')
})
room1.keypad0.resize(36)
room1.keypad0.locate(250,228)

room1.keypad0.onClick = function(){
	printMessage('비밀번호를 입력해 보자.')
	showKeypad('number', this.password, this.callback)
}

room1.cabinet1=new Object(room1,'cabinet1','캐비닛2-1-닫힘.png')
room1.cabinet1.resize(100)
room1.cabinet1.locate(140,330)
room1.cabinet1.lock()

room1.cabinet1.onClick=function(){
	if(!room1.cabinet1.isLocked()){	
		if(room1.cabinet1.isOpened()){
			room1.cabinet1.close()
			room1.cabinet1.setSprite("캐비닛2-1-닫힘.png")
			room1.apple1.hide()
		} else if (room1.cabinet1.isClosed()){
			room1.cabinet1.open()
			room1.cabinet1.setSprite("캐비닛2-1-열림.png")
			room1.apple1.show()
		}
	} else {
		printMessage("캐비닛 문이 열리지 않는다.");
	}
}

room1.apple1=new Object(room1,'apple1','사과.png')
room1.apple1.resize(30)
room1.apple1.locate(125,240)
room1.apple1.hide()
room1.apple1.onClick=function(){
	printMessage("캐비닛 안에 사과가 하나 놓여 있다.")
}

room1.keypad5 = new Keypad(room1, 'keypad5', '키패드-우.png', 'APPLE', function(){
	room1.door1.unlock()
	printMessage('잠금장치가 열렸다!')
})
room1.keypad5.resize(25)
room1.keypad5.locate(930,210)

room1.keypad5.onClick = function(){
	printMessage('알파벳을 입력하면 문이 열리는것 같다. 뭐라고 입력해야 할까?')
	showKeypad('alphabet', this.password, this.callback)
}


room1.door1.onClick = function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if(this.id.isLocked()){
		printMessage("문이 잠겨있다.")
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
			printMessage("큰 액자가 인상깊은 방이군.")
		}
		else {
			Game.end()
		}
	}
}






//room2

room2.door1 = new Door(room2, 'door1', '문2-좌-닫힘.png', '문2-좌-열림.png', room1)
room2.door1.resize(130)
room2.door1.locate(100, 311)

room2.door2 = new Door(room2, 'door2', '문2-우-닫힘.png', '문2-우-열림.png', room3)
room2.door2.resize(120)
room2.door2.locate(1000, 305)
room2.door2.hide()

room2.keypad1 = new Keypad(room2, 'keypad1', '키패드-우.png', '2211', function(){
	printMessage('번호를 입력했더니 문이 나타났다!')
	room2.door2.show()
})
room2.keypad1.resize(20)
room2.keypad1.locate(920, 250)

// onClick 함수를 재정의할 수도 있다
room2.keypad1.onClick = function(){
	printMessage('비밀번호를 입력해야 문이 열릴것 같다.')
	showKeypad('number', this.password, this.callback)
}

room2.photo1=new Object(room2,'photo1','그림1-우.png')
room2.photo1.resize(180)
room2.photo1.locate(880,230)
room2.photo1.onClick=function(){
	printMessage("액자를 치웠더니 잠금장치가 나왔다.")
	room2.photo1.hide()
}

room2.desk1=new Object(room2,'desk1','테이블3-2.png')
room2.desk1.resize(600)
room2.desk1.locate(690,580)

room2.box1=new Object(room2,'box1','상자3-닫힘.png')
room2.box1.resize(100)
room2.box1.locate(300,430)
room2.box1.close()

room2.box1.onClick=function(){
	if(room2.box1.isClosed()){
		room2.box1.open()
		room2.box1.setSprite("상자3-열림.png")
		room2.battery1.show()
	}
	else if(room2.box1.isOpened()){
		room2.box1.close()
		room2.box1.setSprite("상자3-닫힘.png")
	}
}

room2.phone1=new Object(room2,'phone1','전화기-오른쪽-1.png')
room2.phone1.resize(30)
room2.phone1.locate(600,200)
room2.phone1.onClick=function(){
	printMessage("전화기를 들었더니 지지직거리는 소리가 들린다.")
	room2.phone1.setSprite('전화기-오른쪽-2.png')
	playSound("지지직.wav")
}

room2.board1=new Object(room2,'board1','화이트보드-왼쪽.png')
room2.board1.resize(280)
room2.board1.locate(380,230)
room2.board1.onClick=function(){
	printMessage("칠판에 무언가 적혀있다.")
	showImageViewer("화이트보드-왼쪽.png","메추리알.txt")
}

room2.battery1 = new Item(room2, 'battery1', '건전지.png')
room2.battery1.resize(25)
room2.battery1.locate(300,430)
room2.battery1.hide()

room2.battery1.onClick=function(){
	this.id.pick()
	printMessage("박스를 열었더니 건전지가 있다. 챙겨야겠다.")
}

room2.mac1=new Object(room2,'mac1','맥-우.png')
room2.mac1.resize(100)
room2.mac1.locate(690,405)
room2.mac1.onClick=function(){
	showVideoPlayer("메추리알.mp4")
}

room2.post1=new Object(room2,'post1','포스트잇.png')
room2.post1.resize(30)
room2.post1.locate(830,505)
room2.post1.hide()
room2.post1.onClick=function(){
	printMessage("메모다.")
	showImageViewer("종이2.png","책.txt")
}

room2.file1=new Object(room2,'file1','파일-2.png')
room2.file1.resize(100)
room2.file1.locate(830,450)
room2.file1.onClick=function(){
	printMessage("파일 가운데서 무언가 떨어졌다.")
	room2.post1.show()
	}


room2.light1=new Object(room2,'light1','스탠드.png')
room2.light1.resize(100)
room2.light1.locate(1200,360)

room2.light1.onClick=function(){
	if(room2.battery1.isHanded()){
		room2.setRoomLight(1)
		printMessage("조명을 켰다.")
	}
	else{
		printMessage("방이 어둡다. 조명을 켜보자.")
	}
}








//room3
room3.door1 = new Door(room3, 'door1', '문3-좌-닫힘.png', '문3-좌-열림.png', room2)
room3.door1.resize(140)
room3.door1.locate(200, 325)

room3.door2 = new Door(room3, 'door2', '문3-우-닫힘.png', '문3-우-열림.png')
room3.door2.resize(120)
room3.door2.locate(1000, 280)
room3.door2.lock()

room3.lock1 = new DoorLock(room3, 'lock1', '키패드-우.png', '3856', room3.door2, '문이 열렸다!')
room3.lock1.resize(20)
room3.lock1.locate(920, 250)

room3.shelf1=new Object(room3,'shelf1','선반-좌.png')
room3.shelf1.resize(400)
room3.shelf1.locate(550,210)
room3.shelf1.onClick=function(){
	printMessage('선반 위에 무언가가 있는 것 같다. 한번 볼까?')
}

room3.book2=new Object(room3,'book2','책3-1.png')
room3.book2.resize(90)
room3.book2.locate(480,178)
room3.book2.onClick=function(){
	printMessage('책에는 수상한게 없는것 같다.')
}

room3.key1 = new Item(room3, 'key1', '열쇠.png')
room3.key1.resize(45)
room3.key1.locate(600, 190)
room3.key1.onClick=function(){
	this.id.pick()
	printMessage("열쇠를 주웠다!")
}


room3.cabinet2=new Object(room3,'cabinet2','찬장-2-닫힘.png')
room3.cabinet2.resize(180)
room3.cabinet2.locate(1160,365)

room3.cabinet2.onClick=function(){
	printMessage("캐비닛이 잠금장치로 잠겨있다. 열수있는 방법이 없을까?")
	if(room3.key1.isHanded()&&!this.id.isLocked() && this.id.isClosed()){
		room3.cabinet2.open()
		room3.cabinet2.setSprite('찬장-2-열림.png')
		room3.book1.show()
		printMessage("캐비닛 안에 책이 들어있다. 무슨 내용인지 볼까?")
	}
	else {
		printMessage("잠겨있어서 열리지 않는다. 열수있는 방법이 없을까?")
		room3.cabinet2.close()
		room3.cabinet2.setSprite('찬장-2-닫힘.png')
		room3.book1.hide()
	}
}

room3.book1=new Object(room3,'book1','책.png')
room3.book1.resize(30)
room3.book1.locate(1120,360)
room3.book1.hide()
room3.book1.onClick=function(){
	printMessage("흐음....이게 왜 여기 있을까...")
	showImageViewer("종이2.png","갈릴레오.txt")
}

room3.earth1=new Object(room3,'earth1','지구본-1.png')
room3.earth1.resize(50)
room3.earth1.locate(1160,225)
room3.earth1.onClick=function(){
	printMessage('지구본을 살펴보니 무언가 쓰여 있다.')
	showImageViewer("종이2.png","모스크바.txt")
}

room3.carpet2 = new Object(room3, 'carpet2', '카펫.png')
room3.carpet2.resize(530)
room3.carpet2.locate(680,600)
room3.carpet2.onClick=function(){
	printMessage("카펫 아래에는 아무 것도 없다.")
}


room3.desk2=new Object(room3,'desk2','교탁-왼쪽.png')
room3.desk2.resize(330)
room3.desk2.locate(660,370)
room3.desk2.onClick=function(){
	printMessage("책상 위에 노트가 하나 놓여 있다.")
}

room3.note1=new Object(room3,'note1','노트.png')
room3.note1.resize(80)
room3.note1.locate(660,300)
room3.note1.onClick=function(){
	printMessage("무슨 내용인지 볼까?")
	showImageViewer("종이2.png","일기.txt")
}

room3.plant1=new Object(room3,'plant1','식물2-1.png')
room3.plant1.resize(220)
room3.plant1.locate(430,380)
room3.plant1.onClick=function(){
	printMessage('예쁜 화분이다. 특별한건 없어보인다.')
}

room3.chair1=new Object(room3,'chair1','의자1-7.png')
room3.chair1.resize(150)
room3.chair1.locate(800,500)
room3.chair1.onClick=function(){
	printMessage('평범한 의자다.')
}









Game.start(room1, '방탈출에 오신 것을 환영합니다!')