create table BA (
	BACode		nvarchar(50)	not null primary key,
	BAName		nvarchar(50)	null,
	Address		nvarchar(max)	null,
	Tel			nvarchar(50)	null,
	TaxCode		nvarchar(50)	null,
	IsActived	bit				null
);

create table Plant (
	PlantCode	nvarchar(50)	not null primary key,
	BACode		nvarchar(50)	null,
	PlantName	nvarchar(50)	null,
	CCA			nvarchar(50)	null,
	Address		nvarchar(max)	null,
	ContactName nvarchar(50)	null,
	Tel			nvarchar(50)	null,
	Email		nvarchar(50)	null,
	Remark		nvarchar(max)	null,
	IsActived	bit				null
);

create table XLNT_STD (
	ID			int				not null identity(1,1) primary key,
	COD_Min		decimal(18,2)	null,
	COD_Max		decimal(18,2)	null,
	TSS_Min		decimal(18,2)	null,
	TSS_Max		decimal(18,2)	null,
	pH_Min		decimal(18,2)	null,
	pH_Max		decimal(18,2)	null,
	Temp_Min	decimal(18,2)	null,
	Temp_Max	decimal(18,2)	null,
	NH4_Min		decimal(18,2)	null,
	NH4_Max		decimal(18,2)	null,
	In_Min		decimal(18,2)	null,
	In_Max		decimal(18,2)	null,
	Out_Min		decimal(18,2)	null,
	Out_Max		decimal(18,2)	null,
	IsActived	bit				null
);

create table XLNT_Transaction (
	Id			int				not null identity(1,1) primary key,
	COD			decimal(18,2)	null,
	TSS			decimal(18,2)	null,
	pH			decimal(18,2)	null,
	Temp		decimal(18,2)	null,
	NH4			decimal(18,2)	null,
	In1			decimal(18,2)	null,
	In2			decimal(18,2)	null,
	[Out]		decimal(18,2)	null,
	TFlowOut	decimal(18,2)	null,
	FlowOut		decimal(18,2)	null,
	BACode		nvarchar(50)	null,
	PlantCode	nvarchar(50)	null,
	FollowTime	datetime		null
);